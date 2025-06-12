const { getProducer } = require("./producer");

const topics = require("../topic");


async function emitUnlockCartEvent (userId) {
    const producer = await getProducer();
    try {
        await producer.send({
            topic: topics.CART_UNLOCK,
            messages: [
                {
                    value: JSON.stringify({userId}),
                }
            ]
        });

    } catch (error) {
        console.log("Error occurred when emitting unlock event");
    }

}

module.exports = emitUnlockCartEvent;