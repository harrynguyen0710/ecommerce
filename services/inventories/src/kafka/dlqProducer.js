const { kafka } = require("../config/kafka");

const dlqProducer = kafka.producer();

async function connectDlqProducer() {
  await dlqProducer.connect();

  console.log("✅ DLQ Producer connected");
}


async function sendToDlq(topic, payload, key) {
    await dlqProducer.send({
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

    console.warn(`Event moved to DLQ topic: ${topic}`);
   
}

module.exports = {
  dlqProducer,
  connectDlqProducer,
  sendToDlq
};