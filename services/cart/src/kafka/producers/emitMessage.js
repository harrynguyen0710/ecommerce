const { getProducer } = require("./producer");

async function emitMessage(topic, payload) {
    const producer = await getProducer();

    await producer.send({
        topic,
        messages: [
            {
                value: JSON.stringify(payload),
            }
        ]
    });

}

module.exports = emitMessage;