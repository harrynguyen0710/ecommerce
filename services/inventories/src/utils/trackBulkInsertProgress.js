const redis = require("../config/redis");
const logMetrics = require("./logMetrics");

async function trackBulkInsertProgress({
  correlationId,
  recordCount,
  service = "inventory-service",
}) {
  const doneKey = `bulk:${correlationId}:done`;
  const expectedKey = `bulk:${correlationId}:expected`;
  const startKey = `bulk:${correlationId}:startTime`;

  await redis.incrby(doneKey, recordCount);

  const [doneStr, expectedStr] = await redis.mget(doneKey, expectedKey);

  if (doneStr === null || expectedStr === null) {
    throw new Error(
      `❌ Redis keys missing. done=${doneStr}, expected=${expectedStr}`
    );
  }

  if (!Number.isInteger(recordCount)) {
    throw new Error(`❌ Invalid recordCount passed to Redis: ${recordCount}`);
  }

  console.log("DONE STR::", doneStr);
  console.log("EXPEC::", expectedStr);

  const done = parseInt(doneStr, 10);
  const expected = parseInt(expectedStr, 10);

  console.log("done::", done);
  console.log("expected::", expected);

  if (done === expected) {
    const startStr = await redis.get(startKey);
    console.log(`📦 startStr from Redis:`, startStr);

    if (startStr === null) throw new Error("❌ startTime missing in Redis");

    const start = parseInt(startStr, 10);

    const latencyMs = Date.now() - start;

    await logMetrics({
      service,
      event: "bulk.completed",
      correlationId,
      recordCount: done,
      startTimestamp: start, 
    });



    await redis.del(doneKey, expectedKey, startKey);

    console.log(
      `✅ Bulk insert completed for correlationId ${correlationId} in ${latencyMs}ms`
    );
  }
}

module.exports = trackBulkInsertProgress;
