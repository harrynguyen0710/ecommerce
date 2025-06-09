const Cart = require("../models/cart.model");

async function getCartByUserId(userId) {
  const cart = await Cart.findOne({ userId }).lean();

  if (!cart) return null;

  return {
    userId: cart.userId,
    items: cart.items,
    updatedAt: cart.updatedAt,
  };
}

async function deleteCartByUserId(userId) {
  await Cart.deleteOne({ userId });
}

async function updateCartByUserId(userId, data, updatedAtDate) {
  const result = await Cart.updateOne(
    { userId, updatedAt: updatedAtDate },
    { $set: { ...data, updatedAt: new Date() } }
  );

  return result;
}

async function createCartById(userId, items) {
  const created = await Cart.create({ userId, items });

  return created.toObject();
}

module.exports = {
  getCartByUserId,
  updateCartByUserId,
  deleteCartByUserId,
  createCartById,
};
