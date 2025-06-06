const {
  getCart,
  saveAndCacheCart,
  createCart,
} = require("../data/cartDataAccess");

const { getInventoryBySKUs } = require("../../clients/inventory.client");
const { getCart, saveAndCacheCart } = require("../data/cartDataAccess");

class CartService {
  async addToCart(userId, newItem) {
    if (newItem.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const cart = await getCart(userId);
    let updated;

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
        const newCart = {
          userId,
          items: [newItem],
        };

        updated = await createCart(userId, newCart);
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
        updated = await saveAndCacheCart(userId, updatedCart, updatedAtDate);
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
      throw new Error("Inventory service unavailable");
    }

    return updated;
  }

  async updateItemQuantity(userId, sku, newQty) {
    if (newQty <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    try {
      const cart = getCart(userId);

      if (!cart) throw new Error("Cart not found");

      const index = cart.items.findIndex((i) => i.sku === sku);

      if (index === -1) throw new Error(`Item with SKU ${sku} not in cart`);

      const inventoryList = await getInventoryBySKUs([sku]);
      const inventory = inventoryList?.find((i) => i.sku === sku);

      if (!inventory) throw new Error(`SKU ${sku} not found in inventory`);

      const available = inventory.quantity - inventory.reserved;

      if (newQty > available) {
        throw new Error(`Only ${available} units available for SKU ${sku}`);
      }

      const items = [...cart.items];
      items[index].quantity = newQty;

      const updatedCart = { userId, items };
      return await saveAndCacheCart(userId, updatedCart, cart.updatedAt);
    } catch (error) {
      console.error("Something went wrong during updating cart", error);
      throw new Error("Something went wrong during updating cart");
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
      throw new Error("Something went wrong during removing cart");
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
}

module.exports = new CartService();
