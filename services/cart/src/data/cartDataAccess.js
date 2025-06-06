const {
  getCartFromRedis,
  setCartInRedis,
  deleteCartFromRedis,
} = require("../utils/redisCart");

const {
  getCartByUserId,
  updateCartByUserId,
  deleteCartByUserId,
} = require("../repositories/cartRepository");

async function getCart(userId) {
  const cached = await getCartFromRedis(userId);

  if (cached) return cached;

  const cart = await getCartByUserId(userId);

  if (!cart) return null;

  await setCartInRedis(userId, cart);
  return cart;
}

async function saveAndCacheCart(userId, cartData) {
  const updated = await updateCartByUserId(userId, cartData);
  await setCartInRedis(userId, updated);
  return updated;
}

async function deleteCart(userId) {
  await deleteCartByUserId(userId);
  await deleteCartFromRedis(userId);
}

module.exports = {
  getCart,
  saveAndCacheCart,
  deleteCart,
};
