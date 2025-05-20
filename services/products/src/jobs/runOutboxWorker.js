const mongoose = require('mongoose');

require('dotenv').config();

const { connectProducer } = require('../kafka/producer');
const { processOutboxEvents } = require('./outboxProcessor');

async function main() {
    
    // connect to mongodb
    await mongoose.connect(process.env.MONGODB_URI);

    // connect to producer
    await connectProducer();

    setInterval(async () => {
        await processOutboxEvents();
    }, 5000);

    process.exit(0);

}

main().catch(console.error);