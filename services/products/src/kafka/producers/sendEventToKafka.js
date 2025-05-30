const { getConnectedProducer } = require("../producerManager");

const buildKafkaHeaders = require("../../utils/buildKafkaHeaders");

const { SERVICE_INFO } = require("../../constants/index");

async function sendEventToKafka(event, sourceService = SERVICE_INFO.SOURCE) {
  try {
    const producer = await getConnectedProducer();

    const headers = buildKafkaHeaders(event, sourceService);

    await producer.send({
      topic: event.eventType,
      messages: [
        {
          key: event.payload.productId,
          value: JSON.stringify(event.payload),
          headers: headers,
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

module.exports = sendEventToKafka;