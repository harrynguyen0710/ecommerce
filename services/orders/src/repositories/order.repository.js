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

module.exports = {
    createOrder,
}