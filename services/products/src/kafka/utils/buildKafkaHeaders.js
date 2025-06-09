const { KAFKA_HEADERS } = require("../../constants/index");

function buildKafkaHeaders(event, sourceService) {
  return {
    eventId: event._id.toString(),
    sourceService,
    timestamp: new Date().toISOString(),
    [KAFKA_HEADERS.CORRELATION_ID]: event.metadata.correlationId,
    [KAFKA_HEADERS.START_TIMESTAMP]: `${event.metadata.startTimestamp}`,
  };
}


module.exports = buildKafkaHeaders;