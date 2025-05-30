const startConsumer = require("./consumers/startConsumer");

startConsumer().catch((err) => {
  console.error("❌ Failed to start consumer:", err.message);
  process.exit(1);
});
