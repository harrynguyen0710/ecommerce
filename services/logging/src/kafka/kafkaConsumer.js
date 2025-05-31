const kafka = require("../configs/kafka");

async function subscribeWithPattern(consumer, pattern) {
  const admin = kafka.admin();

  await admin.connect();

  const allTopics = await admin.listTopics();

  await admin.disconnect();

  const matchedTopics = allTopics.filter((topic) => pattern.test(topic));

  if (matchedTopics.length === 0) {
    console.warn("⚠️ No topics matched your pattern:", pattern);
  }

  for (const topic of matchedTopics) {
    await consumer.subscribe({ topic, fromBeginning: false });
    console.log(`📡 Subscribed to: ${topic}`);
  }
}

module.exports = subscribeWithPattern
