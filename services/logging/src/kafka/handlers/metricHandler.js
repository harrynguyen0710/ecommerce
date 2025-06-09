const updateMetric = require('../../services/metricsAggregator');

function handleMetricMessage(messageValue) {
    const payload = JSON.parse(messageValue);

    const { service, event, latencyMs, recordCount, timestamp } = payload;

    if (service && event && typeof latencyMs === 'number' && typeof recordCount === 'number') {
        updateMetric({
            service,
            event,
            latencyMs,
            recordCount,
            timestamp: timestamp || new Date().toISOString(),
        });
    } else {
        console.warn('🚨 Invalid metric payload:', payload);
    }
}

module.exports = handleMetricMessage;
