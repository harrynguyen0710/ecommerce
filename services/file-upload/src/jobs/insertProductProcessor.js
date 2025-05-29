const { Worker } = require("bullmq");
const connection = require("../configs/redisConnection");
const { processFileJob } = require("../services/jobHandler");
const { connectProducer } = require("../kafka/producer");

const { QUEUE_NAMES } = require("../constants/index");

(async () => await connectProducer())();

const worker = new Worker(
  QUEUE_NAMES.FILE_UPLOAD,
  async (job) => await processFileJob(job),
  { connection }
);

worker.on("completed", (job) => {
  console.log(`✅ Job completed: ${job.id} - ${job.data.originalName}`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});
