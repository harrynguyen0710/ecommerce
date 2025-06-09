const { getConnectedProducer } = require("../producerManager");

async function sendToDLQ(event, error) {
  const producer = await getConnectedProducer();

  await producer.send({
    topic: `${event.eventType}.dlq`,
    messages: [
      {
        key: event.payload.productId,
        value: JSON.stringify({
          originalEvent: event.payload,
          reason: error.message,
          eventId: event._id.toString(),
          timestamp: new Date().toISOString(),
        }),
      },
    ],
  });
}

module.exports = sendToDLQ;
