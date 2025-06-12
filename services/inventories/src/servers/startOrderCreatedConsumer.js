const orderCreatedConsumer = require("../kafka/consumers/orderCreatedConsumer");
const { connectPrisma } = require("../config/prisma");

(async () => {
  try {
    await connectPrisma();

    await orderCreatedConsumer(); 

    console.log("✅ Inventory update order created consumer started");
  } catch (err) {
    console.error("❌ Failed to start Inventory update order created consumer:", err);
    process.exit(1);
  }
})();