const bulkInsertProductConsumer = require("./productBulkConsumer");

const connectMongo = require("../../databases/mongo");

async function startConsumer() {
  try {
    await connectMongo();
    
    console.log("✅ All Kafka consumers started");
    
    await Promise.all([bulkInsertProductConsumer()]);
  } catch (error) {
    console.error("❌ Failed to start Kafka consumers:", error.message);
    process.exit(1);
  }
}

module.exports = startConsumer;

