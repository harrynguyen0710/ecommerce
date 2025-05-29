const { kafka } = require("../config/kafka");
const { sendToDlq } = require("./dlqProducer");
const { handleProductCreated } = require("./handlers/productCreatedHandler");

const consumer = kafka.consumer({ groupId: "inventory-group" });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: "product.created", fromBeginning: true });
  console.log("Hoang Nguyen in inventory-consumer 123");
  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const payload = JSON.parse(message.value.toString());

      const headers = message.headers || {};

      const correlationId = headers["x-correlation-id"]
        ? headers["x-correlation-id"].toString()
        : "no-id";

      const startTimestamp = headers["x-start-timestamp"]
        ? parseInt(headers["x-start-timestamp"].toString(), 10)
        : Date.now(); // fallback

      console.log(`[${correlationId}] ⏱️ Start timestamp: ${startTimestamp}`);
      console.log("inventory consumer::", payload);

      const productId = payload.productId;

      const MAX_RETRIES = 5;
      let attempt = 0;

      while (attempt < MAX_RETRIES) {
        try {
          await handleProductCreated(payload, {
            correlationId,
            startTimestamp,
          });
          break;
        } catch (error) {
          attempt++;
          console.warn(
            `[${correlationId}] Retry ${attempt}/${MAX_RETRIES} for ${productId}: ${error.message}`
          );
          await new Promise((res) => setTimeout(res, 1000 * attempt));
        }
      }

      if (attempt === MAX_RETRIES) {
        await sendToDlq(
          "product.created.dlq",
          {
            originalEvent: payload,
            reason: "Failed after retries",
          },
          productId
        );
      }
    },
  });
}

module.exports = { startConsumer };
