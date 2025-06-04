const redis = require("../configs/redis");

async function trackBulkInsertProgress({
  correlationId,
  recordCount,
}) {
  const doneKey = `bulk:${correlationId}:done`;
  const startKey = `bulk:${correlationId}:startTime`;

  if (!Number.isInteger(recordCount)) {
    throw new Error(`❌ Invalid recordCount passed to Redis: ${recordCount}`);
  }

  // Increment the "done" count
  await redis.incrby(doneKey, recordCount);

  const [doneStr, startStr] = await redis.mget(doneKey, startKey);

  if (doneStr === null || startStr === null) {
    throw new Error(
      `❌ Redis keys missing. done=${doneStr}, start=${startStr}`
    );
  }

  const done = parseInt(doneStr, 10);
  const startTime = parseInt(startStr, 10);
  const now = Date.now();


  const latencyMs = now - startTime;
  console.log(
    `✅ Bulk insert completed for correlationId ${correlationId} in ${latencyMs}ms and ${done}`
  );

}

module.exports = trackBulkInsertProgress;
