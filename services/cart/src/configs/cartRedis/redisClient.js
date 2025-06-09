const connectRedis = require("./redisConnector");

let redisClient;

async function getRedisClient() {
  if (!redisClient || !redisClient.isOpen) {
    redisClient = await connectRedis();
  }

  return redisClient;
}

module.exports = getRedisClient;
