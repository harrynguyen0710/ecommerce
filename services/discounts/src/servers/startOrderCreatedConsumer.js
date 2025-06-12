const { connectPrisma } = require("../configs/prisma");

const startDiscountConsumer = require("../kafka/consumers/discountConsumer");

(async () => {
  try {
    await connectPrisma();

    await startDiscountConsumer(); 

    console.log("✅ Discount apply consumer started");
  } catch (error) {
    console.error("❌ Failed to start discount apply consumer:", error);
    process.exit(1);
  }
})();