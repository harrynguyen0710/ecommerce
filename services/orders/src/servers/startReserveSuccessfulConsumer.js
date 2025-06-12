const inventoryReseveSuccessfulConsumser = require("../kafka/consumers/inventoryReservedConsumer");

inventoryReseveSuccessfulConsumser()
  .then(() => {
    console.log("✅ inventoryReseveSuccessfulConsumser started");
  })
  .catch((error) => {
    console.error(
      "❌ Failed to start inventoryReseveSuccessfulConsumser:",
      error.message
    );
    process.exit(1);
  });
