const {
  getCart,
  saveAndCacheCart,
  createCart,
} = require("../data/cartDataAccess");

const { getCartByUserId, lockCart, unlockCart, } = require("../repositories/cart.repository");

const { acquireLock, releaseLock, } = require("../utils/redisLock");

const { REDIS } = require("../constants/index");

const { getInventoryBySKUs } = require("../../clients/inventory.client");

class CartService {
  async getCartUser(userId) {
    const cart = await getCart(userId);
    const totalAmount = cart.items.reduce((acc, item) => acc + item.quantity * item.priceAtAdd, 0);
    return {
      cart,
      totalAmount,
    };
  }

  async addToCart(userId, newItem) {
    if (newItem.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const cart = await getCart(userId);
    let updated = {}

    const existingQty =
      cart?.items?.find((i) => i.sku === newItem.sku)?.quantity || 0;
    const totalRequestedQty = existingQty + newItem.quantity;

    try {
      const inventoryList = await getInventoryBySKUs([newItem.sku]);
      const inventory = inventoryList?.find((i) => i.sku === newItem.sku);

      if (!inventory) {
        throw new Error(`SKU ${newItem.sku} not found in inventory`);
      }

      const availableQty = inventory.quantity - inventory.reserved;
      if (totalRequestedQty > availableQty) {
        throw new Error(
          `Only ${availableQty} units available for SKU ${newItem.sku}`
        );
      }

      if (!cart) {
        updated = await createCart(userId, newItem);

      } else {
        const updatedAtDate = cart.updatedAt;

        const items = [...(cart.items || [])];

        const index = items.findIndex((i) => i.sku === newItem.sku);
        if (index !== -1) {
          items[index].quantity += newItem.quantity;
        } else {
          items.push(newItem);
        }

        const updatedCart = { userId, items };
        const result = await saveAndCacheCart(userId, updatedCart, updatedAtDate);
        
        updated = result;

      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      throw new Error(error);
    }

    return updated;
  }

  async updateItemQuantity(userId, sku, newQty) {
    if (newQty <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    try {
      const cart = await getCart(userId);
      if (!cart) throw new Error("Cart not found");

      const index = cart.items.findIndex((i) => i.sku === sku);
      
      if (index === -1) throw new Error(`Item with SKU ${sku} not in cart`);
      
      let desiredQty = Number(newQty) + Number(cart.items[index].quantity);

      const inventoryList = await getInventoryBySKUs([sku]);
      const inventory = inventoryList?.find((i) => i.sku === sku);

      if (!inventory) throw new Error(`SKU ${sku} not found in inventory`);

      const available = inventory.quantity - inventory.reserved;

      if (desiredQty > available) {
        throw new Error(`Only ${available} units available for SKU ${sku}`);
      }

      const items = [...cart.items];
      items[index].quantity = desiredQty;

      const updatedCart = { userId, items };
      return await saveAndCacheCart(userId, updatedCart, cart.updatedAt);
    } catch (error) {
      console.error("Something went wrong during updating cart", error);
      throw new Error(error);
    }
  }

  async removeItemFromCart(userId, sku) {
    try {
      const cart = await getCart(userId);

      if (!cart) throw new Error("Cart not found");

      const items = cart.items.filter((i) => i.sku !== sku);

      if (items.length === cart.items.length) {
        throw new Error(`Item with SKU ${sku} not found in cart`);
      }

      const updatedCart = { userId, items };

      return await saveAndCacheCart(userId, updatedCart, cart.updatedAt);
    } catch (error) {
      console.error("Something went wrong during removing cart", error);
      throw new Error(error);
    }
  }

  async cleanCart(userId) {
    const cart = await getCart(userId);

    if (!cart) throw new Error("Cart not found");
    
    const updatedCart = {
      userId,
      items: [],
    };

    return await saveAndCacheCart(userId, updatedCart, cart.updatedAt);
  }

  async validateAndLockCart(userId) {
    const lockKey = `cart:lock:${userId}`;
    const lockValue = Date.now().toString();

    const locked = await acquireLock(lockKey, REDIS.LOCK_TTL, lockValue);

    if (!locked) {
      throw new Error("Cart is already locked");
    }

    const cart = await getCartByUserId(userId);

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty or doesn't exist");
    }

    await lockCart(userId);

    return cart;
  }

  async unlockCart(userId) {
    const redisKey = `cart:lock:${userId}`;

    await unlockCart(userId);

    await releaseLock(redisKey);
  }

}

module.exports = new CartService();
