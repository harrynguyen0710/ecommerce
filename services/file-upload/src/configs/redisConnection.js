const IORedis = require("ioredis");

const REDIS_HOST = process.env.REDIS_HOST;
const REDIS_PORT = process.env.REDIS_PORT;

const redis = new IORedis({
  host: REDIS_HOST,
  port: REDIS_PORT,

  retryStrategy: (times) => {
    const delay = Math.min(times * 100, 2000);
    console.warn(`🔁 Redis retry attempt #${times}, retrying in ${delay}ms`);
    return delay;
  },

  reconnectOnError: (err) => {
    const targetMessages = ["READONLY", "ECONNRESET", "ETIMEDOUT"];
    const shouldReconnect = targetMessages.some((msg) =>
      err.message.includes(msg)
    );
    if (shouldReconnect) {
      console.warn(`🔄 Reconnecting Redis due to error: ${err.message}`);
    }
    return shouldReconnect;
  },

  maxRetriesPerRequest: null,
  enableOfflineQueue: true, 
});

module.exports = redis;
