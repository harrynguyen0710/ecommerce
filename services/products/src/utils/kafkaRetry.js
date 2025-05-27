const consumer = require("../kafka/consumer");


async function waitForKafkaWithRetry(attempts = 5, delay = 3000) {
  for (let i = 1; i <= attempts; i++) {
    try {
      console.log(`🔁 Attempt ${i}/${attempts} to connect Kafka...`);
      await consumer.connect();
      console.log("✅ Connected to Kafka");
      return;
    } catch (err) {
      console.error(`❌ Kafka not ready (attempt ${i}): ${err.message}`);
      if (i === attempts) throw new Error("Kafka failed after max retries");
      await new Promise((res) => setTimeout(res, delay * i));
    }
  }
}


module.exports = waitForKafkaWithRetry;