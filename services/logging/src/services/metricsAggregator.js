const metricsStore = {};

function updateMetric({ service, event, latencyMs, recordCount, timestamp }) {
  if (!metricsStore[service]) metricsStore[service] = {};

  const entry = metricsStore[service][event] || {
    totalEvents: 0,
    totalLatencyMs: 0,
    totalRecords: 0,
    avgLatencyMs: 0,
    lastUpdated: null,
  };

  entry.totalEvents += 1;
  entry.totalLatencyMs += latencyMs;
  entry.totalRecords += recordCount;
  entry.avgLatencyMs = entry.totalLatencyMs / entry.totalEvents;
  entry.lastUpdated = timestamp;

  metricsStore[service][event] = entry;
}

updateMetric.store = metricsStore;

module.exports = updateMetric;
