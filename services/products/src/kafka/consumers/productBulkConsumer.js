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
    eachBatch: async ({
      batch,
      resolveOffset,
      heartbeat,
      commitOffsetsIfNecessary,
    }) => {
      try {
        const products = [];

        for (const message of batch.messages) {
          const payload = JSON.parse(message.value.toString());
          
          console.log("payload::", payload);

          if (!Array.isArray(payload)) {
            console.error("❌ Expected payload to be an array of products");
            continue;
          }

          products.push(...payload);

          resolveOffset(message.offset);

          await heartbeat();
        }
        if (products.length > 0) {
          await productService.insertManyProducts(products);
          console.log(`✅ Inserted ${products.length} products.`);
        }

        await commitOffsetsIfNecessary();
      } catch (error) {
        console.error("Error happens when insert many products");
      }
    },
  });

  console.log("🚀 bulkInsertProductConsumer is running");
}

module.exports = bulkInsertProductConsumer;
