
const handleMetricMessage = require("../handlers/metricHandler");

const subscribeWithPattern = require("../kafkaConsumer");

const kafka = require("../../configs/kafka");

const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID;

const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID });

async function startKafkaConsumer() {
  await consumer.connect();

  await subscribeWithPattern(consumer, /^metrics\..*/);


  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      try {
        console.log(`📨 [${topic}] Message:`, message.value.toString());

        handleMetricMessage(message.value.toString());
      } catch (error) {
        console.error("❌ Failed to process Kafka message:", err);
      }
    },
  });
}

module.exports = startKafkaConsumer;
