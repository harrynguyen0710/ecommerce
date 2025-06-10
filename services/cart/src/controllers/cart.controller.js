const CartService = require("../services/cart.service");

class CartController {
  async getCart(req, res) {
    try {
      const userId = req.userId;
      
      const result = await CartService.getCartUser(userId);
      
      if (!result) return res.status(404).json({ message: "Not found!" });
      
      return res.status(200).json(result);

    } catch (error) {
      console.error("❌ getCart:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }  

  async addToCart(req, res) {
    try {
      const userId = req.userId;
      const newItem = req.body;

      const result = await CartService.addToCart(userId, newItem);
      return res.status(200).json(result);
    } catch (error) {
      console.error("❌ addToCart:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  async updateItemQuantity(req, res) {
    try {
      const userId = req.userId;
      const { sku } = req.params;
      const { quantity } = req.body;

      const result = await CartService.updateItemQuantity(userId, sku, quantity);
      return res.status(200).json(result);
    } catch (error) {
      console.error("❌ updateItemQuantity:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  async removeItemFromCart(req, res) {
    try {
      const userId = req.userId;
      const { sku } = req.params;

      const result = await CartService.removeItemFromCart(userId, sku);
      return res.status(200).json(result);
    } catch (error) {
      console.error("❌ removeItemFromCart:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  async cleanCart(req, res) {
    try {
      const userId = req.userId;

      const result = await CartService.cleanCart(userId);
      return res.status(200).json(result);
    } catch (error) {
      console.error("❌ cleanCart:", error.message);
      return res.status(400).json({ message: error.message });
    }
  }

  async lockCart(req, res) {
    try {
      const userId = req.userId;

      const cart = await CartService.validateAndLockCart(userId);

      return res.status(200).json({ success: true, cart });

    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async unlockCart(req, res) {
    try {
      const userId = req.userId;

      await CartService.unlockCart(userId);

      return res.status(204).json({ success: true, messsage: "Cart is unlocked" });

    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

}

module.exports = new CartController();
