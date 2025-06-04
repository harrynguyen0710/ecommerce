const redis = require("../configs/redisConnection");

async function setExpectedBulkCount(correlationId, totalCount, ttlInSeconds = 120) {
  await redis.set(`bulk:${correlationId}:expected`, totalCount, 'EX', ttlInSeconds);
}

async function setBulkStartTime(correlationId, startTime, ttlInSeconds = 120) {
  await redis.set(`bulk:${correlationId}:startTime`, startTime, 'EX', ttlInSeconds);
}

module.exports = {
  setExpectedBulkCount,
  setBulkStartTime,
};