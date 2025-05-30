const OutboxEvent = require("../models/outbox.model");


const { LIMIT } = require("../constants/index");

async function getEvents() {
    const pendingEvents = await OutboxEvent.find({
        status: 'pending',
        retries: {
            $lt: LIMIT.RETRIES,
        }
    }).limit(LIMIT.RERORDS);

    return pendingEvents;
}

async function markAsSent(eventId) {
    return OutboxEvent.updateOne(
        { _id: eventId },
        {
            $set: {
                status: "sent",
                lastTriedAt: new Date(),
            },
        }
    )
}



async function markManyAsSent(eventIds = []) {
    if (!Array.isArray(eventIds) || eventIds.length === 0) return;

    return OutboxEvent.updateMany(
        { _id: { $in: eventIds } },
        {
            $set: {
                status: "sent",
                lastTriedAt: new Date()
            }
        }
    )
}

async function updateRetryInfo(eventId, error) {
  return OutboxEvent.findByIdAndUpdate(
    eventId,
    {
      $set: {
        lastTriedAt: new Date(),
        error: error.message,
      },
      $inc: { retries: 1 },
    },
    { new: true }
  );
}


async function markAsFailed(eventId) {
    return OutboxEvent.updateOne(
        { _id: eventId }, 
        { $set: { status: "failed" }} 
    );
}

module.exports = {
    markAsSent,
    markManyAsSent,
    markAsFailed,
    updateRetryInfo,
    getEvents,
    
}