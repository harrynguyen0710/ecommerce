const { v4: uuidv4 } = require("uuid");

function generateCorrelationMetadata() {
  return {
    correlationId: uuidv4(),
    startTimestamp: Date.now(),
  };
}

module.exports = {
  generateCorrelationMetadata,
};
