const orderCreateConsumer = require("../kafka/consumers/orderCreatedConsumer");

orderCreateConsumer()
  .then(() => console.log("Cart cleanup consumer started (order.created)"))
  .catch((err) => {
    console.error("Failed to start cart cleanup consumer:", err);
    process.exit(1);
  });    