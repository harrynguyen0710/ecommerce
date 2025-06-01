const chunkArray = require("../../utils/csv/chunkArray");
const { getConnectedProducer } = require("../producerManager");

const MAX_BATCH_SIZE = 6000; // messages;

const TOPICS = require("../topics");

async function produceProductCreated(payload, headers = {}) {
  const producer = await getConnectedProducer();
  console.log("payload::", payload);

  const failed = [];

  const chunks = chunkArray(payload, MAX_BATCH_SIZE);

  for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
    const chunk = chunks[chunkIndex];

    const messages = [{
        value: JSON.stringify(chunk),
        headers,
    }];

    try {
      await producer.sendBatch({
        topicMessages: [
          {
            topic: TOPICS.PRODUCT_CREATED,
            messages,
          },
        ],
      });

      console.log(
        `✅ Sent batch ${chunkIndex + 1}/${chunks.length} (${
          messages.length
        } messages)`
      );
    } catch (error) {
      console.error(
        `❌ Failed to send batch ${chunkIndex + 1}: ${error.message}`
      );

      chunk.forEach((product, i) => {
        const globalIndex = chunkIndex * MAX_BATCH_SIZE + i;
        failed.push({
          index: globalIndex,
          product,
        });
      });
    }
  }

  return {
    total: payload.length,
    failed,
  }
}

module.exports = {
  produceProductCreated,
};
