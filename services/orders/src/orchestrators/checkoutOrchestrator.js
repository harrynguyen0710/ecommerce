const { previewDiscount } = require("../../clients/discount.client");
const { validateAndLock } = require("../../clients/cart.client");

const publishInventoryReservation = require("../kafka/producers/publishInventoryReservation");

const { v4: uuidv4 } = require("uuid");

async function checkoutOrchestrator({ token, userId, appliedVouchers = [] }) {
  const correlationId = uuidv4();

  const cartResponse = await validateAndLock(token);

  if (!cartResponse.success) {
    throw new Error("Something went wrong with cart service");
  }

  const cart = cartResponse.cart;

  const discounts = await previewDiscount(token, {
    appliedVouchers,
    cartIems: cart.items,
    totalAmount: cart.totalAmount,
  });

  if (!discounts.success) {
    throw new Error(`Discount validation failed: ${discounts.data.message}`);
  }

  const { totalDiscount, finalTotal, applied } = discounts.data;

  await publishInventoryReservation({
    correlationId,
    userId,
    items: cart.items,
    meta: {
      discountAmount: totalDiscount,
      finalAmount: finalTotal,
      validVouchers: applied,
      originalTotal: cart.totalAmount,
      appliedVouchers,
    },
  });

  return {
    success: true,
    message: "Checkout initiated successfully",
    data: {
      userId,
      totalDiscount,
      finalTotal,
      appliedVoucher: applied,
      correlationId,
      cartItems: cart.items,
    },
  };
}

module.exports = checkoutOrchestrator;
