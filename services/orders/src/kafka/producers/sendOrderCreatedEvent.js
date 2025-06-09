const getProducer = require("./producer");

const topics = require("../topic");

async function sendOrderCreatedEvent({ order, correlationId }) {
    const producer = getProducer();

    await producer.send({
        topic: topics.ORDER_CREATED,
        messages: [
            {
                value: JSON.stringify({
                    orderId: order.id,
                    userId: order.userId,
                    items: order.items,
                    discountCode: order.discountCode,
                    totalAmount: order.totalAmount,
                    correlationId,
                }),
                headers: {
                    correlationId,
                }
            }
        ]
    });
}

module.exports = sendOrderCreatedEvent;
