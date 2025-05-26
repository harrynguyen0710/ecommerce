const consumer = require("../kafka/consumer");

const productService = require("../services/products.service");

async function startProductConsumer() {
  await consumer.connect();
  await consumer.subscribe({
    topic: "product.bulk.created",
    fromBeginning: true,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());
      await productService.create(payload);
    },
  });

  console.log("📡 Product bulk consumer running...");
}

module.exports = {
    startProductConsumer,
}