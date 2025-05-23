const OutboxEvent = require("../models/outbox.model");

const { sendEventToKafka, sendToDLQ } = require("../kafka/sendEventToKafka");

const MAX_RETRIES = 5;

async function handleOutboxEvent(event) {
  const result = await sendEventToKafka(event);

  if (result.success) {
    await OutboxEvent.updateOne(
      { _id: event._id },
      {
        $set: {
          status: "sent",
          lastTriedAt: new Date(),
        },
      }
    );

    console.log(`✅ Sent event ${event.eventType} (${event._id})`);
  } else {
    const updated = await OutboxEvent.findByIdAndUpdate(
        event._id,
        {
            $set: {
                lastTriedAt: new Date(),
                error: result.error.message,
            }, 
            $inc: {
                retries: 1
            }
        }, 
        { new: true }
    );

    console.error(`❌ Failed to send event ${event._id}:`, result.error.message);

    if (updated.retries >= MAX_RETRIES) {
        
        await OutboxEvent.updateOne(
            { _id: event._id },
            { $set: { status: 'failed' } }
        );

        await sendToDLQ(event, result.error);
        
        console.warn(`🔁 Moved event ${event._id} to DLQ`);

    }

  }
}


module.exports = {
  handleOutboxEvent,
}