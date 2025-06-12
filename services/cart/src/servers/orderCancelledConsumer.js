const orderCancelledConsumer = require("../kafka/consumers/orderCancelledConsumer");

const connectMongo = require("../configs/mongo");
(async () => {
  try {
    await connectMongo(); 

    await orderCancelledConsumer(); 

    console.log("✅ Order cancelled consumer started");
  } catch (err) {
    console.error("❌ Failed to start order cancelled consumer:", err);
    process.exit(1);
  }
})();
