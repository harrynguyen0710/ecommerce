const checkoutConsumer = require("../kafka/consumers/checkoutConsumer");

checkoutConsumer()
  .then(() => console.log("Checkout consumer started"))
  .catch((err) => {
    console.error("Failed to start checkout consumer:", err);
    process.exit(1);
  });
