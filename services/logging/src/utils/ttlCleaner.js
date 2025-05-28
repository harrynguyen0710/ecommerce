const updateMetric = require("../services/metricsAggregator");

const METRIC_TTL_MINITES = process.env.METRIC_TTL_MINITES;

function startTTLCleaner() {
    setInterval(() => {
        const now = new Date();
        const store = updateMetric.store;

        for (const [service, events] of Object.entries(store)) {
            for (const [event, data] of Object.entries(events)) {
                const last = new Date(data.lastUpdated);

                const diffMin = (now - last) / 60000;

                if (diffMin > METRIC_TTL_MINITES) {
                    delete store[service][event];
                }
            }

            if (Object.keys(store[service]).length === 0) {
                delete store[service];
            }
        }
    }, 60 * 1000);
}

module.exports = startTTLCleaner;