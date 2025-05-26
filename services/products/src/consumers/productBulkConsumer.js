const { startProductConsumer } = require('../services/productConsumer.service');

startProductConsumer().catch((err) => {
  console.error('❌ Failed to start product bulk consumer:', err.message);
  process.exit(1);
});
