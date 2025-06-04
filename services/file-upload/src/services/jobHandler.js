const { parseCSV } = require("./csvProcessor");
const transformRow = require("../utils/csv/transformRow");

const logMessagesTracing = require("../utils/tracing/messageProcessTracing");

const { streamParseCSV } = require("../services/streamParseCSV");


async function processFileJob(job) {
  const { filePath, originalName, correlationId, startTimestamp } = job.data;


  const { total, failed } = await streamParseCSV(
    filePath,
    transformRow,
    correlationId,
    startTimestamp
  );
  
  console.log(`✅ Processing file: ${originalName}`);

  logMessagesTracing(total, failed);
}

module.exports = { processFileJob };
