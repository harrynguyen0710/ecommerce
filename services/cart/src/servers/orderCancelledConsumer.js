const orderCancelledConsumer = require("../kafka/consumers/orderCancelledConsumer");

orderCancelledConsumer()
  .then(() => console.log("Order cancelled consumer started"))
  .catch((err) => {
    console.error("Failed to start order cancelled consumer:", err);
    process.exit(1);
  });
