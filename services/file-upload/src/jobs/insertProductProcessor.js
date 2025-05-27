const fs = require("fs");
const csv = require("csv-parser");
const { Worker } = require("bullmq");
const connection = require("../configs/redisConnection");

const parseCsvRowToProduct = require("../utils/parseProductCSV");
const { connectProducer } = require("../kafka/producer");
const { produceProductCreated } = require("../kafka/produceProductCreated");

(async () => {
  await connectProducer();
  console.log("Kafka producer connected");
})();

const worker = new Worker(
  "file-upload-queue",
  async (job) => {
    const {
      filePath,
      originalName,
      correlationId,
    } = job.data;

    console.log(
      `[${correlationId}] 🚀 Starting job to process file: ${originalName}`
    );

    return new Promise((resolve, reject) => {
      let failedRows = 0;
      let processedRows = 0;

      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", async (row) => {
          console.log(`[${correlationId}] 🧪 Raw CSV Row:`, row);
          const product = parseCsvRowToProduct(row);
          console.log(`[${correlationId}] 🧪 Parsed Product:`, product);
          if (!product) {
            console.warn(`[${correlationId}] ⚠️ Skipped invalid row`);
            failedRows++;
            return;
          }

          try {
            await produceProductCreated(product, correlationId);
            const skus = product?.variants?.map((v) => v.sku).join(", ") || "no variants";
            console.log(
              `[${correlationId}] 📨 Kafka message sent for SKU(s): ${skus}`
            );
            processedRows++;
          } catch (err) {
            failedRows++;
            console.error(
              `[${correlationId}] ❌ Failed to send to Kafka: ${err.message}`
            );
          }
        })
        .on("end", async () => {
          console.log(
            `[${correlationId}] ✅ File processed. Success: ${processedRows}, Failed: ${failedRows}`
          );
          resolve();
        })
        .on("error", (error) => {
          console.error(
            `[${correlationId}] ❌ File processing error: ${error.message}`
          );
          reject(error);
        });
    });
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`[${job.data.correlationId}] ✅ Job completed: ${job.id}`);
});

worker.on("failed", (job, err) => {
  console.error(
    `[${job.data.correlationId}] ❌ Job ${job.id} failed:`,
    err.message
  );
});
