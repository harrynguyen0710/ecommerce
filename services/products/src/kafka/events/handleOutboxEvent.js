const { markAsSent, updateRetryInfo } = require("../../repositories/outbox.repository");

const sendEventToKafka = require("../producers/sendEventToKafka");

const { handleRetry } = require("../../services/outbox.service");

async function handleOutboxEvent(event) {
  const result = await sendEventToKafka(event);

  if (result.success) {
    await markAsSent(event._id);
    
    console.log(`✅ Sent event ${event.eventType} (${event._id})`);
  } else {
    const updated = await updateRetryInfo(event._id, result.error);

    console.error(
      `❌ Failed to send event ${event._id}:`,
      result.error.message
    );

    // retry
    await handleRetry(event, updated, result.error);

  }
}

module.exports = {
  handleOutboxEvent,
};
