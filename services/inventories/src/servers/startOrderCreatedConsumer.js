const orderCreatedConsumer = require("../kafka/consumers/orderCreatedConsumer");

orderCreatedConsumer().then(() => {
  console.log("✅ orderCreatedConsumer started");
}).catch((err) => {
  console.error("❌ Failed to start orderCreatedConsumer:", err.message);
  process.exit(1);
});
