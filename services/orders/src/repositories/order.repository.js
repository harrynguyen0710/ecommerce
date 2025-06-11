const { prisma } = require("../configs/prisma");

async function createOrder({ userId, totalAmount, discountCode, items }) {
    const order = await prisma.order.create({
        data: {
            userId,
            totalAmount,
            discountCode: discountCode || null,
            status: "CREATED",
            items: {
                create: items.map((item) => ({
                    productId: item.productId,
                    sku: item.sku,
                    quantity: item.quantity,
                    priceAtAdd: item.priceAtAdd,
                })),
            },
        },
        include: { items: true },
    });

    return order;
}

async function getOrders() {
    const orders = await prisma.order.findMany({
        include: {
            items: true,
            appliedDiscounts: true,
        }
    });
    return orders;
}

module.exports = {
    createOrder,
    getOrders,
}