const getRedisClient = require("../configs/cartRedis/redisClient");

const acquireLock = async (key, ttlSeconds, value = Date.now().toString()) => {
    const redis = await getRedisClient();

    const result = await redis.set(key, value, "NX", "EX", ttlSeconds);
    
    return result === "OK";
};

const releaseLock = async (key) => {
  const redis = await getRedisClient();

  const result = await redis.del(key);

  return result === 1;
};


module.exports = {
    acquireLock,
    releaseLock,
};