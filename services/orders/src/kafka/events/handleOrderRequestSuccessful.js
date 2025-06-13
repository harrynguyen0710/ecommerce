const orderService = require("../../services/order.service");

const sendOrderCreatedEvent = require("../producers/sendOrderCreatedEvent");
const sendOrderCreatedFailEvent = require("../producers/sendOrderCreatedFailEvent");

async function handleOrderRequestSuccessful(payload) {
  const { discountAmount, finalAmount, appliedVouchers, items, userId } = payload;

  const order = await orderService.createNewOrder(
    discountAmount,
    finalAmount,
    appliedVouchers,
    items,
    userId
  );

  if (order) {
    await sendOrderCreatedEvent(order);
  } else {
    await sendOrderCreatedFailEvent(items);
  }

  await emitUnlockCartEvent(userId);
}

module.exports = handleOrderRequestSuccessful;
