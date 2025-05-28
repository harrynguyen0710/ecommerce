const { dlqProducer, connectDlqProducer } = require("../kafka/dlqProducer");

async function logMetrics({ service, event, startTimestamp, recordCount, correlationId = 'unknown' }) {
  const latencyMs = Date.now() - (startTimestamp || Date.now());

  try {
    await producer.send({
      topic: `metrics.${service}`,
      messages: [
        {
          value: JSON.stringify({
            service,
            event,
            latencyMs,
            recordCount,
            timestamp: new Date().toISOString(),
            correlationId,
          })
        }
      ]
    });
  } catch (err) {
    console.error('❌ Failed to log metrics:', err.message);
  }
}

module.exports = logMetrics;
