const { kafkaProducer } = require("./producer");

async function sendEventToKafka(event) {
  try {
    const correlationId = event.metadata?.correlationId || "no-id";
    const startTimestamp = event.metadata?.startTimestamp || Date.now();
    
    await kafkaProducer.send({
      topic: event.eventType,
      messages: [
        {
          key: event.payload.productId,
          value: JSON.stringify(event.payload),
          headers: {
            eventId: event._id.toString(),
            sourceService: "product-service",
            timestamp: new Date().toISOString(),
            "x-correlation-id": correlationId,
            "x-start-timestamp": `${startTimestamp}`,
          },
        },
      ],
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
}

async function sendToDLQ(event, error) {
  await kafkaProducer.send({
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

module.exports = {
  sendEventToKafka,
  sendToDLQ,
};
