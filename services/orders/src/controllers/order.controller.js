const orderService = require("../services/order.service");

class OrderController {
  async getOrders(req, res) {
    try {
      const orders = await orderService.getAllOrders();

      return res.status(200).json(orders);

    } catch (error) {
      console.error("Error during fetching orders::", error.message);
      return res.status(500).json(error);
    }
  }
}

module.exports = new OrderController();
