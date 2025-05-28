const updateMetric = require("../services/metricsAggregator");

class LoggingController {
    getAllMetrics(req, res) {
        res.json(updateMetric.store);
    } 

    getServiceMetrics(req, res) {
        const { service } = req.params;
        res.json(updateMetric.store[service] || {});
    }

    getEventMetrics(req, res) {
        const { service, event } = req.params;
        res.json(updateMetric.store[service]?.[event] || {});
    }
}

module.exports = new LoggingController();