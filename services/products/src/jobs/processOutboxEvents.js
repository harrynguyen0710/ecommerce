const outboxModel = require('../models/outbox.model');

const { handleOutboxEvent } = require('./handleOutboxEvent');

async function processOutboxEvents() {
    const pendingEvents = await outboxModel.find({
        status: 'pending',
        retries: { $lt: 5 },
    }).limit(500);

    console.log('pendingEvents::', pendingEvents)

    console.log(`Processing ${pendingEvents.length} outbox events...`);
    
    for (const event of pendingEvents) {
        console.log('event::', event);
        await handleOutboxEvent(event);
    }

    console.log('-------------------------------------------')
    
}

module.exports = {
    processOutboxEvents,
}