const startProductCreatedConsumer = require("./kafka/consumers/startProductCreatedConsumer");

async function startAllConsumers() {
  try {
    await Promise.all([startProductCreatedConsumer()]);
  } catch (error) {
    console.error("❌ Failed to start Kafka consumers:", err);
    process.exit(1);
  }
}

startAllConsumers();
