const { previewDiscount } = require("../../clients/discount.client");
const { validateAndLock } = require("../../clients/cart.client");

const cleanCart = require("../utils/cleanCart");

const calculateTotal = require("../utils/calculateTotal");

const publishInventoryReservation = require("../kafka/producers/publishInventoryReservation");

const { v4: uuidv4 } = require("uuid");

async function checkoutOrchestrator({ token, userId, appliedVouchers = [] }) {
  const correlationId = uuidv4();
  console.log("token::", token);
  console.log("userId::", userId);
  console.log("appliedVouchers::", appliedVouchers);

  const cartResponse = await validateAndLock(token);


  if (!cartResponse.success) {
    throw new Error("Something went wrong with cart service");
  }

  const cart = cartResponse.cart;
  
  const totalAmount  = calculateTotal(cart.items)
  
  const cleanedCart = cleanCart(cart.items, ["sku", "quantity", "priceAtAdd"]);
  console.log("cleanedCart::", cleanedCart);
  
  const discounts = await previewDiscount(token, {
    appliedVouchers,
    cartItems: cleanedCart,
    totalAmount,
    userId
  });

  if (!discounts.success) {
    throw new Error(`Discount validation failed: ${discounts.message}`);
  }

  console.log("discounts::", discounts);
  const { totalDiscount, finalTotal, applied } = discounts;

  await publishInventoryReservation({
    correlationId,
    userId,
    items: cart.items,
    meta: {
      discountAmount: totalDiscount,
      finalAmount: finalTotal,
      validVouchers: applied,
      originalTotal: totalAmount,
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
