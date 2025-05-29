const consumer = require("../kafka/consumer");
const waitForKafkaWithRetry = require("../utils/kafkaRetry");
const productService = require("../services/products.service");
const logMetrics = require("../utils/logMetrics");

async function startProductConsumer() {
  await waitForKafkaWithRetry();

  await consumer.subscribe({
    topic: "product.bulk.created",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = JSON.parse(message.value.toString());

      const correlationId =
        message.headers?.["x-correlation-id"]?.toString() || "no-id";
      const startTimestamp = parseInt(
        message.headers?.["x-start-timestamp"]?.toString() || `${Date.now()}`,
        10
      );

      console.log("product payload::", payload);
      console.log("product messages::", message);
      console.log("correlationId::", correlationId);
      console.log("startTimestamp::", startTimestamp);

      console.log("-------------------------------------------------");

      await logMetrics({
        service: "product.bulk.consumer",
        event: "product.bulk.consumer",
        startTimestamp,
        recordCount: 0,
        correlationId,
      });

      await productService.create(payload, { correlationId, startTimestamp });
    },
  });
}

module.exports = {
  startProductConsumer,
};
