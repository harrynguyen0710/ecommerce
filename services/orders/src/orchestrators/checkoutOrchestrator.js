const { previewDiscount } = require("../../clients/discount.client");
const { validateAndLock } = require("../../clients/cart.client");

const publishInventoryReservation = require("../kafka/producers/publishInventoryReservation");

const { v4: uuidv4 } = require("uuid");

async function checkoutOrchestrator({ token, userId, appliedVouchers = [] }) {
    const correlationId = uuidv4();

    const cart = await validateAndLock(token);

    const discounts = await previewDiscount(token, {
        appliedVouchers,
        cartIems: cart.items,
        totalAmount: cart.totalAmount,
    });

    if (!discounts.data.success) {
        throw new Error(`Discount validation failed: ${discounts.data.message}`);
    }

    const { discountAmount, finalAmount, validVouchers } = discounts.data;

    await publishInventoryReservation({
        correlationId,
        userId, 
        items: cart.items,
        meta: {
            discountAmount,
            finalAmount,
            validVouchers,
            originalTotal: cart.totalAmount,
            appliedVouchers,
        },
    });

    return { success: true, message: "Inventory reservation requests", correlationId };
}


module.exports = checkoutOrchestrator;
