const mongoose = require('mongoose');

const { getConnectedProducer } = require("../kafka/producerManager");

const { processOutboxEvents } = require('../kafka/events/processOutboxEvents');

async function main() {
    console.log('Starting outbox worker...');
    // connect to mongodb
    await mongoose.connect(process.env.MONGO_URI);

    // connect to producer
    await getConnectedProducer();

    setInterval(async () => {
        await processOutboxEvents();
    }, 5000);


}

main().catch(console.error);