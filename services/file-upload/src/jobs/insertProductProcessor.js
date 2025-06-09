const { Worker } = require("bullmq");
const redis = require("../configs/redisConnection");
const { processFileJob } = require("../services/jobHandler");

const { QUEUE_NAMES } = require("../constants/index");


const {
  setBulkStartTime,
} = require("../utils/bulkTracking");

const worker = new Worker(
  QUEUE_NAMES.FILE_UPLOAD,
  async (job) => {
    await setBulkStartTime(job.data.correlationId, job.data.startTimestamp);
    await processFileJob(job);
  },
  { connection: redis }
);

worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id} - ${job.data.originalName}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});
