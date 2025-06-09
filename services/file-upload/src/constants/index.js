// Queue names
const QUEUE_NAMES = {
  FILE_UPLOAD: 'file-upload-queue',
};

// Job names
const JOB_NAMES = {
  PROCESS_CSV: 'process-csv',
};

// Kafka headers
const KAFKA_HEADERS = {
  CORRELATION_ID: 'x-correlation-id',
  START_TIMESTAMP: 'x-start-timestamp',
};

// Metric events
const METRIC_EVENTS = {
  FILE_PARSED: 'product.bulk.csv.read',
};

// Services
const SERVICE_NAMES = {
  FILE_UPLOAD: 'file-upload-service',
};

// Paths
const PATHS = {
  UPLOADS: './uploads',
};

module.exports = {
  QUEUE_NAMES,
  JOB_NAMES,
  KAFKA_HEADERS,
  METRIC_EVENTS,
  SERVICE_NAMES,
  PATHS,
};
