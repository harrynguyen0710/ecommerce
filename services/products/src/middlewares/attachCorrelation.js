const { v4: uuidv4 } = require("uuid");

function attachCorrelation(req, res, next) {
  req.meta = {
    correlationId: req.headers["x-correlation-id"] || `http-api-${uuidv4()}`,
    startTimestamp: Date.now(),
  };
  next();
}

module.exports = attachCorrelation;
