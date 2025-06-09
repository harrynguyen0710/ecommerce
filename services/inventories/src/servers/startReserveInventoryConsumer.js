const reserveInventoryConsumer = require("../kafka/consumers/reserveInventoryConsusmer");

reserveInventoryConsumer().then(() => {
  console.log("✅ reserveInventoryConsumer started");
}).catch((err) => {
  console.error("❌ Failed to start reserveInventoryConsumer:", err.message);
  process.exit(1);
});
