const { kafka } = require("../config/kafka");
const { sendToDlq } = require("./dlqProducer");
const { handleProductCreated } = require("./handlers/productCreatedHandler");

const consumer = kafka.consumer({ groupId: "inventory-group" });

async function startConsumer() {
  await consumer.connect();

  await consumer.subscribe({ topic: "product.created", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const payload = JSON.parse(message.value.toString());

      const productId = payload.productId;
      const MAX_RETRIES = 5;

      let attempt = 0;

      while (attempt < MAX_RETRIES) {
        try {
          await handleProductCreated(payload);

          return; // handled successfully
        } catch (error) {
          attempt++;

          console.warn(`Retry ${attempt}/${MAX_RETRIES} for ${productId}`);
          await new Promise((res) => setTimeout(res, 1000 * attempt));
        }
      }

      await sendToDlq(
        "product.created.dlq",
        {
          originalEvent: payload,
          reason: "Failed after retries",
        },
        productId
      );
    },
  });
}

module.exports = { startConsumer };
