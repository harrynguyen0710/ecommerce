const { v4: uuidv4 } = require("uuid");

const fetchUserCart = require("../../clients/cart.client");

const calculateTotal = require("../utils/calculateTotal");

const { createOrder } = require("../repositories/order.repository");
const applyDiscountCode = require("../../clients/discount.client");

class OrderService {
    async createNewOrder({ userId, discountCode, token }) {
        const correlationId = uuidv4();

        const cartItems = await fetchUserCart(token);

        if (!cartItems || cartItems.length === 0) {
            throw new Error("Cart is empty.");
        }

        const subtotal = calculateTotal(cartItems);

        let discountAmount = 0;

        if (discountCode) {
            const result = await applyDiscountCode({ code: discountCode, totalAmount: subtotal });

            if (!result.success) {
                throw new Error("Invalid or expired discount code.");
            }

            discountAmount = result.discountAmount;
        }

        const totalAmount = Math.max(subtotal - discountAmount, 0);

        const order = await createOrder({
            userId,
            totalAmount,
            discountCode,
            items: cartItems,
        });

    }

}

module.exports = OrderService;