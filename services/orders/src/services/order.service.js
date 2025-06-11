const calculateTotal = require("../utils/calculateTotal");

const { createOrder } = require("../repositories/order.repository");
const {applyDiscountCode} = require("../../clients/discount.client");

class OrderService {
    async createNewOrder(totalDiscount, finalTotal, appliedVoucher, cartItems, userId) {

        if (!cartItems || cartItems.length === 0) {
            throw new Error("Cart is empty.");
        }

        const order = await createOrder({
            userId,
            totalAmount: finalTotal,
            totalDiscount,
            discountVouchers: appliedVoucher,
            items: cartItems,
        });

        return order;
    }

}

module.exports = new OrderService();