const redis = require("../config/redis");

async function trackBulkInsertProgress({
  correlationId,
  startTimestamp,
  service = "inventory-service",
  event = "product.bulk.completed",
}) {
  const redisKeyExpected = `bulk:${correlationId}:expected`;
  const redisKeyCount = `bulk${correlationId}:count`;

  const actual = await redis.incr(redisKeyCount);
  const expected = await redis.get(redisKeyExpected);

  if (expected && Number(actual) === Number(expected)) {
    await logMetrics({
      service,
      event,
      startTimestamp,
      recordCount: Number(actual),
      correlationId,
    });

    await redis.del(redisKeyExpected);
    await redis.del(redisKeyCount);
  }
}

module.exports = trackBulkInsertProgress;
