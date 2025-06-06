const {
  getCart,
  saveAndCacheCart,
  createCart,
} = require("../data/cartDataAccess");

class CartService {
  async addToCart(userId, newItem) {
    const cart = await getCart(userId);

    let updated;

    if (!cart) {
      const newCart = {
        userId,
        items: [newItem],
      };

      updated = await createCart(userId, newCart);

    } else {
      const updatedAtDate = cart.updatedAt;

      const items = [...(cart.items || [])];

      // check newitem exists in the cart
      const index = items.findIndex((i) => i.sku === newItem.sku);

      if (index !== -1) {
        items[index].quantity += newItem.quantity;
      } else {
        items.push(newItem);
      }

      const updatedCart = { userId, items };

      updated = await saveAndCacheCart(userId, updatedCart, updatedAtDate);
    }

    return updated;
  }
}

module.exports = new CartService();
