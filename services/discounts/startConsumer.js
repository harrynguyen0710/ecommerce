const startDiscountConsumer = require("./src/kafka/consumers/discountConsumer");

(async () => {
  try {
    await startDiscountConsumer();
  } catch (err) {
    console.error("❌ Failed to start Discount Kafka Consumer:", err);
    process.exit(1);
  }
})();