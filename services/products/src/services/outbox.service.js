const { markAsFailed } = require("../repositories/outbox.repository");

const sendToDLQ = require("../kafka/producers/sendToDLQ");

const MAX_RETRIES = 5;

async function handleRetry(event, updatedDoc, error) {
    if (updatedDoc.retries >= MAX_RETRIES) {
        await markAsFailed(event._id);
        await sendToDLQ(event, error);
        
        console.warn(`🔁 Moved event ${event._id} to DLQ`);

    }
}

module.exports = {
    handleRetry,
}