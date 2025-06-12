const { createOrder, getOrders, } = require("../repositories/order.repository");


class OrderService {
    async createNewOrder(totalDiscount, finalTotal, appliedVoucher, cartItems, userId) {
        if (!cartItems || cartItems.length === 0) {
            return null;
        }

        console.log("order::", totalDiscount, finalTotal, appliedVoucher, cartItems, userId);

        const order = await createOrder({
            userId,
            totalAmount: finalTotal,
            totalDiscount,
            discountVouchers: appliedVoucher,
            items: cartItems,
        });

        return order;
    }

    async getAllOrders() {
        return await getOrders();
    }

}

module.exports = new OrderService();