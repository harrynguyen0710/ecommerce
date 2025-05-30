const { getConnectedProducer } = require("../producer");


async function sendToDlq(topic, payload, key) {
    const producer = await getConnectedProducer();
    
    await producer.send({
        topic, 
        messages: [
            {
                key,
                value: JSON.stringify(payload),
                headers: {
                    reasons: payload.reasons || 'handler failed',
                    timestamp: new Date().toISOString()
                }
            }
        ]
    });

    console.log(`Event moved to DLQ topic:: ${topic}`);
}

module.exports = sendToDlq;