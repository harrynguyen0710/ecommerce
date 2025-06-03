const chunkArray = require("../../utils/csv/chunkArray");
const { getConnectedProducer } = require("../producerManager");

const MAX_BATCH_SIZE = 25000; // messages;


const TOPICS = require("../topics");

async function produceProductCreated(payload, headers = {}) {
  const producer = await getConnectedProducer();

  // console.log("payload::", payload);

  const failed = [];

  const chunks = chunkArray(payload, MAX_BATCH_SIZE);

  const tasks = chunks.map((chunk, chunkIndex) => {
    if (!Array.isArray(chunk)) {
      console.error(`❌ Chunk at index ${chunkIndex} is not an array`, chunk);
      return Promise.resolve();
    }

    const messages = [
      {
        value: JSON.stringify(chunk), 
        headers,
      },
    ];

    return producer
      .sendBatch({
        topicMessages: [
          {
            topic: TOPICS.PRODUCT_CREATED,
            messages,
          },
        ],
      })
      .then(() => {
        console.log(
          `✅ Sent batch ${chunkIndex + 1}/${chunks.length} (${
            messages.length
          } messages)`
          
        );
          console.log("chunk.length::", chunk.length)

      })
      .catch((error) => {
        console.error(
          `❌ Failed to send batch ${chunkIndex + 1}: ${error.message}`
        );
        chunk.forEach((product, i) => {
          const globalIndex = chunkIndex * MAX_BATCH_SIZE + i;
          failed.push({ index: globalIndex, product });
        });
      });
  });

  await Promise.allSettled(tasks);

  return {
    total: payload.length,
    failed,
  };
}

module.exports = {
  produceProductCreated,
};
