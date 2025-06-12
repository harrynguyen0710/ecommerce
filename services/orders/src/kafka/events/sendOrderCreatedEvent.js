const { getProducer} = require("../producers/producer");

const topics = require("../topic");

async function sendOrderCreatedEvent(order) {
    const producer = await getProducer();
    console.log("sendOrderCreatedEvent::", order);
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
