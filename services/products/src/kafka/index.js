const bulkInsertProductConsumer = require("./consumers/productBulkConsumer");

async function startConsumer() {
  try {
    await Promise.all([bulkInsertProductConsumer()]);

    console.log("✅ All Kafka consumers started");
  } catch (error) {
    console.error("❌ Failed to start Kafka consumers:", error.message);
    process.exit(1);
  }
}

module.exports = startConsumer;

