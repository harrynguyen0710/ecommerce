const { getConnectedProducer } = require("../producer");

async function emitInventoryStatus(topic, messagePayload) {
    const producer = await getConnectedProducer();

    await producer.send({
        topic,
        messages: [
            {
                value: JSON.stringify(messagePayload),
            }
        ]
    })

}

module.exports = emitInventoryStatus
