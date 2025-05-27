const consumer = require("../kafka/consumer");
const waitForKafkaWithRetry = require("../utils/kafkaRetry");
const productService = require("../services/products.service");

async function startProductConsumer() {
  await waitForKafkaWithRetry();

  await consumer.subscribe({
    topic: "product.bulk.created",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const payload = JSON.parse(message.value.toString());

      const correlationId = message.headers?.['x-correlation-id']?.toString() || 'no-id';
      const startTimestamp = parseInt(
        message.headers?.['x-start-timestamp']?.toString() || `${Date.now()}`,
        10
      );

      await productService.create(payload, { correlationId, startTimestamp });
    },
  });
}

module.exports = {
  startProductConsumer,
};
