const { KAFKA_HEADERS } = require("../../constants/index");

function parseKafkaHeaders(headers = {}) {
    const correlationId = headers[KAFKA_HEADERS.CORRELATION_ID];
    const startTimestamp = headers[KAFKA_HEADERS.START_TIMESTAMP];

    return { correlationId, startTimestamp }
}


module.exports = {
    parseKafkaHeaders,
}