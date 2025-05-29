const kafka = require("../../configs/kafka");

const handleMetricMessage = require("../handlers/metricHandler");

const subscribeToTopic = require("../utils/subscribeToTopic");

const { METRICS_TOPIC_PATTERN } = require("../topic");

const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID;

async function startKafkaConsumer() {
  const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID });

  await consumer.connect();

  await subscribeToTopic({
    consumer,
    topics: [METRICS_TOPIC_PATTERN],
    fromBeginning: true,
    retries: 5,
    retryDelayMs: 1000,
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        handleMetricMessage(message.value.toString());
      } catch (error) {
        console.error("❌ Failed to process Kafka message:", err);
      }
    },
  });
}

module.exports = startKafkaConsumer;
