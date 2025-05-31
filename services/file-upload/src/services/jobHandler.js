const { parseCSV } = require("./csvProcessor");
const transformRow = require("../utils/csv/transformRow");

const { produceProductCreated } = require("../kafka/events/produceProductCreated");

const logMetrics = require("../utils/logMetrics");

const { setExpectedBulkCount, setBulkStartTime } = require("../utils/bulkTracking");

const { KAFKA_HEADERS, SERVICE_NAMES, METRIC_EVENTS } = require("../constants/index");

async function processFileJob(job) {
  const { filePath, originalName, correlationId, startTimestamp } = job.data;

  console.log(`✅ Processing file: ${originalName}`);

  await setBulkStartTime(correlationId, startTimestamp);
    
  const { success, failed } = await parseCSV(filePath, async (row) => {
    const payload = transformRow(row);
    await produceProductCreated(payload, {
      [KAFKA_HEADERS.CORRELATION_ID] : correlationId,
      [KAFKA_HEADERS.START_TIMESTAMP]: `${startTimestamp}`,
    });
  });
  
  
  await setExpectedBulkCount(correlationId, success);

  await logMetrics({
    service: SERVICE_NAMES.FILE_UPLOAD,
    event: METRIC_EVENTS.FILE_PARSED,
    startTimestamp,
    recordCount: success,
    correlationId,
  });

  console.log(`✅ Finished. Success: ${success}, Failed: ${failed}`);
}

module.exports = { processFileJob };

