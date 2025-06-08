const getRedisClient = require("../configs/cartRedis/redisClient");


const CART_TTL_SECONDS = 60 * 60 * 24 * 30;

function getCartKey(userId) {
  return `cart:user:${userId}`;
}

async function getCartFromRedis(userId) {
  const redis = await getRedisClient();
  const key = getCartKey(userId);
  const data = await redis.get(key);
  if (data) {
    await redis.expire(key, CART_TTL_SECONDS); 
  }

  return data ? JSON.parse(data) : null;
}

async function setCartInRedis(userId, cartData, ttl = CART_TTL_SECONDS) {
  console.log("cart Data::", cartData);
  const redis = await getRedisClient();
  const key = getCartKey(userId);

  await redis.set(key, JSON.stringify(cartData), { EX: ttl });
}

async function deleteCartFromRedis(userId) {
  const redis = await getRedisClient();
  const key = getCartKey(userId);

  await redis.del(key);
}

module.exports = {
  getCartKey,
  getCartFromRedis,
  setCartInRedis,
  deleteCartFromRedis,
  CART_TTL_SECONDS,
};
