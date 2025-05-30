const { getConnectedProducer } = require("../producer");


async function sendToDlq(topic, payload, key) {
    const producer = await getConnectedProducer();
    
    const headers = {
        reason: payload.reason || "handler failed",
        timestamp: new Date().toISOString(),
    };

    await producer.send({
        topic, 
        messages: [
            {
                key,
                value: JSON.stringify(payload),
                headers,
            }
        ]
    });

    console.log(`Event moved to DLQ topic:: ${topic}`);
}

module.exports = sendToDlq;