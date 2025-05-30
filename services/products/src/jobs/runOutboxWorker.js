const mongoose = require('mongoose');

const { connectProducer } = require('../kafka/producer');
const { processOutboxEvents } = require('../kafka/events/processOutboxEvents');

async function main() {
    console.log('Starting outbox worker...');
    // connect to mongodb
    await mongoose.connect(process.env.MONGO_URI);

    // connect to producer
    await connectProducer();

    setInterval(async () => {
        await processOutboxEvents();
    }, 5000);


}

main().catch(console.error);