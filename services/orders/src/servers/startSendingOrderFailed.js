const inventoryFailedConsumser = require("../kafka/consumers/inventoryFailedConsumer");

inventoryFailedConsumser()
  .then(() => {
    console.log("✅ inventoryFailedConsumser started");
  })
  .catch((error) => {
    console.error(
      "❌ Failed to start inventoryFailedConsumser:",
      error.message
    );
    process.exit(1);
  });
