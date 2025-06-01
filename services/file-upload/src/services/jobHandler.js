const { parseCSV } = require("./csvProcessor");
const transformRow = require("../utils/csv/transformRow");

const {
  produceProductCreated,
} = require("../kafka/events/produceProductCreated");

const logMetrics = require("../utils/logMetrics");

const logMessagesTracing = require("../utils/tracing/messageProcessTracing");

const {
  setExpectedBulkCount,
  setBulkStartTime,
} = require("../utils/bulkTracking");

const {
  KAFKA_HEADERS,
  SERVICE_NAMES,
  METRIC_EVENTS,
} = require("../constants/index");

async function processFileJob(job) {
  const { filePath, originalName, correlationId, startTimestamp } = job.data;

  console.log(`✅ Processing file: ${originalName}`);

  await setBulkStartTime(correlationId, startTimestamp);

  try {
    const rawRows = await parseCSV(filePath);

    const payload = rawRows.map(transformRow);

    const { total, failed } = await produceProductCreated(payload, {
      [KAFKA_HEADERS.CORRELATION_ID]: correlationId,
      [KAFKA_HEADERS.START_TIMESTAMP]: `${startTimestamp}`,
    });

    await setExpectedBulkCount(correlationId, total);

    await logMetrics({
      service: SERVICE_NAMES.FILE_UPLOAD,
      event: METRIC_EVENTS.FILE_PARSED,
      startTimestamp,
      recordCount: total,
      correlationId,
    });

    logMessagesTracing(total, failed);

  } catch (error) {
    console.error("❌ Critical error in file job:", error.message);
  }
}

module.exports = { processFileJob };
