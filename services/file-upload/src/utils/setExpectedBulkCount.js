const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

async function setExpectedBulkCount(correlationId, totalCount, ttlInSeconds = 3600) {
  await redis.set(`bulk:${correlationId}:expected`, totalCount, 'EX', ttlInSeconds);
}

module.exports = setExpectedBulkCount;