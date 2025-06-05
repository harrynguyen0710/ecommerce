const { getConnectedProducer } = require("../producerManager");
const { groupByTopic } = require("../utils/messageBuilder");

async function sendBatchEvents(events, sourceService) {
  const producer = await getConnectedProducer();

  const topicMessages = groupByTopic(events, sourceService);

  await producer.sendBatch({
    topicMessages,
  });
}

async function sendBatchMessages(data, topic) {
  const producer = await getConnectedProducer();

  const messages = data.map(item => ({
    value: JSON.stringify(item),
  }));

  if (messages.length === 0) {
    console.warn("⚠️ sendBatchMessages called with empty message array");
    return;
  }

  console.log(`🛫 Sending ${messages.length} messages to topic: ${topic}`);

  await producer.sendBatch({
    topicMessages: [
      {
        topic,
        messages,
      },
    ],
  });

  console.log(`✅ Batch sent to topic: ${topic}`);
}


module.exports = { sendBatchEvents, sendBatchMessages };
