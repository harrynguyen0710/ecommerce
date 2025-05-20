const outboxModel = require('../models/outbox.model');

const { handleOutboxEvent } = require('./handleOutboxEvent');

async function processOutboxEvents() {
    const pendingEvents = await outboxModel.find({
        status: 'pending',
        retries: { $lt: 5 },
    }).limit(10);

    for (const event of pendingEvents) {
        await handleOutboxEvent(event);
    }
    
}

module.exports = {
    processOutboxEvents,
}