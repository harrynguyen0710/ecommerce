const LIMIT = {
    RERORDS: 100,
    RETRIES: 5
}


const SERVICE_INFO = {
    SOURCE: 'product-service'
}

const KAFKA_HEADERS = {
  CORRELATION_ID: 'x-correlation-id',
  START_TIMESTAMP: 'x-start-timestamp',
};


module.exports = {
    LIMIT,
    SERVICE_INFO,
    KAFKA_HEADERS,
}