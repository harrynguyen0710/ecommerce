const consumer = require("../consumer");
const waitForKafkaWithRetry = require("../utils/kafkaRetry");
const productService = require("../../services/products.service");

const { KAFKA_HEADERS } = require("../../constants/index");

const { PRODUCT_BULK_CREATED } = require("../topics");

async function bulkInsertProductConsumer() {
  await waitForKafkaWithRetry();

  await consumer.subscribe({
    topic: PRODUCT_BULK_CREATED,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = JSON.parse(message.value.toString());

      const correlationId = message.headers?.[KAFKA_HEADERS.CORRELATION_ID]?.toString() || 'no-id';
      const startTimestamp = parseInt(
        message.headers?.[KAFKA_HEADERS.START_TIMESTAMP]?.toString() || `${Date.now()}`,
        10
      );

      await productService.create(payload, { correlationId, startTimestamp });
    },
  });

  console.log("🚀 bulkInsertProductConsumer is running");

}

module.exports = {
  bulkInsertProductConsumer,
};
