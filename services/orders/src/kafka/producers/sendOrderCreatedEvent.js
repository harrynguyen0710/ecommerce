const { getProducer} = require("../configs/producer");

const topics = require("../topic");

async function sendOrderCreatedEvent(order) {
    const producer = await getProducer();

    await producer.send({
        topic: topics.ORDER_CREATED,
        messages: [
            {
                value: JSON.stringify(order),
            }
        ]
    });
}

module.exports = sendOrderCreatedEvent;
