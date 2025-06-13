const cartService = require("../../services/cart.service");

async function orderCreatedEvent() {
  try {
    await cartService.cleanCart(userId);
    console.log("Cleared cart successfully");
  } catch (error) {
    console.error(`Failed to clear cart for ${userId}:`, error.message);
  }
}

module.exports = orderCreatedEvent;
