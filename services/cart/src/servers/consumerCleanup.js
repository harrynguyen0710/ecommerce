const orderCreateConsumer = require("../kafka/consumers/orderCreatedConsumer");

const connectMongo = require("../configs/mongo");


(async () => {
  try {
    await connectMongo();

    await orderCreateConsumer();

    console.log("✅ Order created consumer started");
  } catch (error) {
    console.error("❌ Failed to start order created consumer:", error);
    process.exit(1);
  }
})();
