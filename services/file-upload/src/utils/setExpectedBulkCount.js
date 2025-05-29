const redis = require("../configs/redisConnection");

async function setExpectedBulkCount(correlationId, totalCount, ttlInSeconds = 3600) {
  await redis.set(`bulk:${correlationId}:expected`, totalCount, 'EX', ttlInSeconds);
}

module.exports = setExpectedBulkCount;