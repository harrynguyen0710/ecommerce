function validateTopicPatterns(topics) {
  const topicArray = Array.isArray(topics) ? topics : [topics];

  for (const topic of topicArray) {
    if (topic instanceof RegExp) {
      console.warn(`⚠️ [Warning] Kafka won't validate if RegExp matches real topics: ${topic}`);
    }
  }
}

module.exports = validateTopicPatterns;