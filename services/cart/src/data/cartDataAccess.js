const {
  getCartFromRedis,
  setCartInRedis,
  deleteCartFromRedis,
} = require("../utils/redisCart");

const {
  getCartByUserId,
  updateCartByUserId,
  deleteCartByUserId,
  createCartById,
} = require("../repositories/cart.repository");

async function getCart(userId) {
  const cached = await getCartFromRedis(userId);

  if (cached) return cached;

  const cart = await getCartByUserId(userId);

  if (!cart) return null;

  await setCartInRedis(userId, cart);
  return cart;
}

async function saveAndCacheCart(userId, cartData, updatedAtDate) {
  const result = await updateCartByUserId(userId, cartData, updatedAtDate);

  if (result.modifiedCount === 0) throw new Error("Cart was modified by another request. Retry required.");

  await setCartInRedis(userId, updated);
  return updated;
  
}

async function deleteCart(userId) {
  await deleteCartByUserId(userId);
  await deleteCartFromRedis(userId);
}

async function createCart(userId, cartData, ttl = CART_TTL_SECONDS) {
  await setCartInRedis(userId, cartData, ttl); 
  const cart = await createCartById(userId, cartData);
  return cart;
}

module.exports = {
  getCart,
  saveAndCacheCart,
  deleteCart,
  createCart, 
};
