const fs = require("fs");
const csv = require("csv-parser");

const { produceProductCreated } = require("../kafka/events/produceProductCreated");

const { KAFKA_HEADERS } = require("../constants/index");

const BATCH_SIZE = 5000;

async function streamParseCSV(filePath, transformRow, correlationId, startTimestamp) {
  return new Promise((resolve, reject) => {
    const rows = [];
    let batchCount = 0;
    let failed = [];
    let total = 0;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", async (row) => {
        rows.push(transformRow(row));

        if (rows.length >= BATCH_SIZE) {
          const currentBatch = [...rows.splice(0, BATCH_SIZE)];
          const { failed: failedBatch } = await produceProductCreated(currentBatch, {
            [KAFKA_HEADERS.CORRELATION_ID]: correlationId,
            [KAFKA_HEADERS.START_TIMESTAMP]: `${startTimestamp}`,
          });

          failed = failed.concat(failedBatch);
          batchCount++;
          total += currentBatch.length;
        }
      })
      .on("end", async () => {
        if (rows.length > 0) {
          const { failed: failedBatch } = await produceProductCreated(rows, {
            [KAFKA_HEADERS.CORRELATION_ID]: correlationId,
            [KAFKA_HEADERS.START_TIMESTAMP]: `${startTimestamp}`,
          });

          failed = failed.concat(failedBatch);
          total += rows.length;
          batchCount++;
        }

        console.log(`✅ Completed ${batchCount} batches`);
        resolve({ total, failed });
      })
      .on("error", reject);
  });
}

module.exports = { streamParseCSV };