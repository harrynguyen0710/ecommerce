const { getConnectedProducer } = require("../kafka/producerManager");

async function logMetrics({ service, event, startTimestamp, recordCount, correlationId = 'unknown' }) {
    const latencyMs = Date.now() - (startTimestamp || Date.now());
    
    const producer = await getConnectedProducer();

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
    } catch (error) {
        console.error('❌ Failed to log metrics:', error.message);
    }
}

module.exports = logMetrics;