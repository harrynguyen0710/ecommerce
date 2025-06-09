const { handleOutboxEvent } = require("./handleOutboxEvent");

async function fallbackRetryEvents(events) {
  console.warn(`🔁 Falling back to individual retries...`);
  
  if (events) {
    for (const event of events) {
      await handleOutboxEvent(event);
    }
  }
}

module.exports = fallbackRetryEvents;
