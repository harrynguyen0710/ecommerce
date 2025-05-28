const { startProductConsumer } = require('../services/productConsumer.service');
const connectMongo = require('../databases/mongo');

async function start() {
  await connectMongo(); 
  await startProductConsumer();
}

start().catch((err) => {
  console.error("❌ Failed to start product bulk consumer:", err.message);
  process.exit(1);
});