const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const validateTopicPatterns = require('./validateTopicPatterns');

async function subscribeToTopic({
  consumer,
  topics,
  fromBeginning = true,
  retries = 3,
  retryDelayMs = 2000,
  log = true,
}) {

    let attempt = 0

    const topicArray = Array.isArray(topics) ? topics : [topics];

    while (attempt < retries) {
        try {
            for (const topic of topicArray) {
                await consumer.subscribe({ topic, fromBeginning });
                if (log) {
                    console.log(`📡 Subscribed to: ${topic.toString()}`);
                }
            }

            validateTopicPatterns(topicArray);

            return;
        } catch (error) {
            onsole.error(`❌ Failed to subscribe (attempt ${attempt + 1}/${retries}):`, err.message);
            attempt++;
            if (attempt < retries) await delay(retryDelayMs);
        }
    }
      
    throw new Error(`❌ Failed to subscribe to topics after ${retries} attempts`);

}

module.exports = subscribeToTopic;
