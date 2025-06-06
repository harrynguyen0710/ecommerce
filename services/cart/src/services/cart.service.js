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
}

module.exports = new CartService();
