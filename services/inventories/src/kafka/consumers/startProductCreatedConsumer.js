const kafka  = require("../../config/kafka");

const { routeMessage } = require("../routeMessage");

const topics = require("../topics");

const { parseKafkaHeaders } = require("../utils/metadataParser");

const { retryWithBackoff } = require("../utils/retryWithBackoff");

const sendToDlq = require("../producers/sendToDlq");

const { GROUP_CONSUMERS } = require("../../constants/index");

const consumer = kafka.consumer({ groupId: GROUP_CONSUMERS.INVENTORY_GROUP });

async function startProductCreatedConsumer() {
  await consumer.connect();
  await consumer.subscribe({ topic: topics.PRODUCT_CREATED, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      console.log("📩 Received message on", topic);
      console.log("📦 Message value:", message.value.toString());
      const payload = JSON.parse(message.value.toString());

      const meta = parseKafkaHeaders(message.headers);

      const productId = payload.productId;

      try {
        await retryWithBackoff(() => routeMessage(topic, payload, meta), {
          retries: 5,
          delay: 1000,
          onRetry: (err, attempt) =>
            console.warn(
              `[${meta.correlationId}] Retry ${attempt}/5 for ${productId}: ${err.message}`
            ),
        });
      } catch (finalError) {
        await sendToDlq(
          topics.DLQ_PRODUCT_CREATED,
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

module.exports =  startProductCreatedConsumer;
