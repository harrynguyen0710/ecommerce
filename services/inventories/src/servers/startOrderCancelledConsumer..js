const orderRevertConsumer = require("../kafka/consumers/orderRevertConsumer");

orderRevertConsumer().then(() => {
  console.log("✅ orderCancelledConsumer started");
}).catch((err) => {
  console.error("❌ Failed to start orderCancelledConsumer:", err.message);
  process.exit(1);
});
