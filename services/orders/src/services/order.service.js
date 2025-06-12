const { createOrder, getOrders } = require("../repositories/order.repository");

class OrderService {
  async createNewOrder(
    finalTotal,
    appliedVoucher,
    cartItems,
    userId
  ) {
    if (!cartItems || cartItems.length === 0) {
      return null;
    }

    const order = await createOrder({
      userId,
      totalAmount: finalTotal,
      appliedDiscounts: appliedVoucher, 
      items: cartItems,
    });

    return order;
  }

  async getAllOrders() {
    return await getOrders();
  }
}

module.exports = new OrderService();
