const { SERVICE_INFO } = require("../../constants");
const {
  getEvents,
  markManyAsSent,
} = require("../../repositories/outbox.repository");

const sendBatchEvents = require("./sendBatchEvents");

const fallbackRetryEvents = require("../events/fallbackRetryEvents")

async function processOutboxEvents() {
  const pendingEvents = await getEvents();

  console.log(`📦 Processing ${pendingEvents.length} outbox events...`);

  if (pendingEvents.length === 0) return;

  try {
    await sendBatchEvents(pendingEvents, SERVICE_INFO.SOURCE);

    const ids = pendingEvents.map((e) => e._id);

    await markManyAsSent(ids);

    console.log(`✅ Batch sent ${ids.length} events successfully`);
  } catch (error) {
    console.error(`❌ Batch send failed: ${error.message}`);
    await fallbackRetryEvents(pendingEvents);
  }
}

module.exports = {
  processOutboxEvents,
};
