const { handleOutboxEvent } = require("./handleOutboxEvent");

async function fallbackRetryEvents(events) {
  console.warn(`🔁 Falling back to individual retries...`);

  for (const event of events) {
    await handleOutboxEvent(event);
  }
}

module.exports = fallbackRetryEvents;
