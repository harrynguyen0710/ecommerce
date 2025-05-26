const fs = require("fs");

const csv = require("csv-parser");
const { Worker } = require("bullmq");
const connection = require("../configs/redisConnection");

const { connectProducer } = require("../kafka/producer");
const { produceProductCreated } = require("../kafka/produceProductCreated");

(async () => {
  await connectProducer();
})();

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    const { filePath, originalName } = job.data;

    console.log(`✅ Starting job to process file: ${originalName}`);

    return new Promise((resolve, reject) => {
      let failedRows = 0;
      let processedRows = 0;

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", async (row) => {
          try {
            const payload = {
              title: row.title,
              variants: [
                {
                  sku: row.sku,
                  price: parseFloat(row.price),
                  quantity: parseInt(row.quantity),
                  color: row.color,
                  size: row.size,
                },
              ],
            };

            await produceProductCreated(payload);
            processedRows++;
          } catch (err) {
            failedRows++;
            console.error(`❌ Failed to send row to Kafka:`, row, err.message);
          }
        })
        .on("end", () => {
          console.log(
            `✅ File processed. Success: ${processedRows}, Failed: ${failedRows}`
          );
          resolve();
        })
        .on("error", (error) => {
          console.error(`❌ Error processing file: ${error.message}`);
          reject(error);
        });
    });
  },
  {
    connection,
  }
);

worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id} - ${job.data.originalName}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});
