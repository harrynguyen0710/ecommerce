const consumer = require("../consumer");
const waitForKafkaWithRetry = require("../utils/kafkaRetry");
const productService = require("../../services/products.service");

const { PRODUCT_BULK_CREATED } = require("../topics");

const trackBulkInsertProgress = require("../../utils/trackBulkProgress");

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
      isRunning,
      isStale,
    }) => {
      try {
        console.log(
          `📦PID:  ${process.pid} |  Partition: ${batch.partition} | Batch size: ${batch.messages.length}`
        );

        const products = [];
        
        const correlationId = batch.messages[0]?.headers?.['x-correlation-id']?.toString();

        for (const message of batch.messages) {
          const payload = JSON.parse(message.value.toString());

          if (!isRunning() || isStale()) {
            break;
          }

          if (!Array.isArray(payload)) {
            console.error("❌ Expected payload to be an array of products");
            continue;
          }

          await heartbeat();

          products.push(...payload);

          resolveOffset(message.offset);

          await heartbeat();
        }

        if (products.length > 0) {
          
          await productService.insertManyProducts(products);
          
          await heartbeat();
          
          console.log(`✅ Inserted ${products.length} products.`);

          await trackBulkInsertProgress({
            correlationId,
            recordCount: products.length,
            
          });
        }

        await commitOffsetsIfNecessary();
      } catch (error) {
        console.error("Error happens when insert many products::", error);
      }
    },
  });

  console.log("🚀 bulkInsertProductConsumer is running");
}

module.exports = bulkInsertProductConsumer;
