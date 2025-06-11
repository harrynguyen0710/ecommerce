
class OrderController {
  async createOrder(req, res) {
    const token = req.token;
    const userId = req.userId;
//     data: { totalDiscount, finalTotal, appliedVoucher, correlationId, cartItems: cart.items },

    try {

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Checkout failed: " + error.message,
      });
    }
  }
}

module.exports = new OrderController();
