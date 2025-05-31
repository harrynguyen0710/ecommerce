const consumer = require("../consumer");
const waitForKafkaWithRetry = require("../utils/kafkaRetry");
const productService = require("../../services/products.service");

const { KAFKA_HEADERS } = require("../../constants/index");

const { PRODUCT_BULK_CREATED } = require("../topics");

const sendToDLQ = require("../producers/sendToDLQ");

const MAX_RETRIES = 5;

async function bulkInsertProductConsumer() {
  await waitForKafkaWithRetry();

  await consumer.subscribe({
    topic: PRODUCT_BULK_CREATED,
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = JSON.parse(message.value.toString());

      console.log('message::', message);
      console.log('payload::', payload);

      const correlationId =
        message.headers?.[KAFKA_HEADERS.CORRELATION_ID]?.toString() || "no-id";
      const startTimestamp = parseInt(
        message.headers?.[KAFKA_HEADERS.START_TIMESTAMP]?.toString() ||
          `${Date.now()}`,
        10
      );

      let retry = 0;

      while (retry < MAX_RETRIES) {
        try {
          await productService.create(payload, {
            correlationId,
            startTimestamp,
          });
          break;
        } catch (error) {
          console.error(
            `❌ Failed to process message. Retry #${retry}`,
            error.message
          );
          retry++;
          if (retry === MAX_RETRIES) {
            sendToDLQ(payload.event, error);
            console.error(
              `💀 Max retries reached for correlationId: ${correlationId}`
            );
          }
        }
      }
    },
  });

  console.log("🚀 bulkInsertProductConsumer is running");
}

module.exports = bulkInsertProductConsumer;
