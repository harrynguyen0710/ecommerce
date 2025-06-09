const inventoryBulkCreatedConsumer = require("./consumers/inventoryBulkCreatedConsumer");

inventoryBulkCreatedConsumer()
  .then(() => console.log("✅ inventoryBulkCreatedConsumer running"))
  .catch((err) => {
    console.error("❌ Failed to start inventoryBulkCreatedConsumer", err);
    process.exit(1);
  });
