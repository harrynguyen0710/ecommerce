const  getProducer = require("./producer");

const topics = require("../topic");

async function emitOrderCreated(orderPayload) {
    const producer = await getProducer();

    await producer.send({
        topic: topics.ORDER_CREATED,
        messages: [
            {
                value: JSON.stringify(orderPayload),
            }
        ],
    });

}

module.exports = emitOrderCreated;
