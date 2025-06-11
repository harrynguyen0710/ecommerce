const { getProducer } = require("./producer");

const topics = require("../topic");


async function emitUnlockCartEvent (userId) {
    const producer = await getProducer();

    await producer.send({
        topic: topics.CART_UNLOCK,
        messages: [
            {
                value: JSON.stringify(userId),
            }
        ]
    });

}

module.exports = emitUnlockCartEvent;