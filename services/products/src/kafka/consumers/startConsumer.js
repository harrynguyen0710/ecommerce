const bulkInsertProductConsumer = require("./productBulkConsumer");

async function startConsumer() {
  try {
    console.log("✅ All Kafka consumers started");
    
    await Promise.all([bulkInsertProductConsumer()]);
  } catch (error) {
    console.error("❌ Failed to start Kafka consumers:", error.message);
    process.exit(1);
  }
}

module.exports = startConsumer;

