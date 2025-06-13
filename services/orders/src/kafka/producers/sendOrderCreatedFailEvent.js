const { getProducer} = require("../configs/producer");

const topics = require("../topic");


async function sendOrderCreatedFailEvent(cartItems) {
    const producer = await getProducer();

    await producer.send({
        topic: topics.ORDER_FAILED,
        messages: [
            {
                value: JSON.stringify(cartItems),
            }
        ]
    })

}

module.exports = sendOrderCreatedFailEvent;
