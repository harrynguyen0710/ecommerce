const { getConnectedProducer } = require("../kafka/producer");

async function logMetrics({ service, event, correlationId, recordCount, startTimestamp }) {
  const latencyMs = Date.now() - (startTimestamp);

  console.log('in logging Metrics:::', Date.now())
  console.log('current_day::', startTimestamp)
  console.log('final one::', Date.now() - startTimestamp);
  console.log('------------------------------');

  try {
    const producer = await getConnectedProducer();

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
  } catch (error) {
    console.error('❌ Failed to log metrics:', error.message);
  }
}

module.exports = logMetrics;
