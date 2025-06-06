const Cart = require("../models/cart.model");

async function getCartByUserId(userId) {
    return Cart.findOne({ userId }).lean();
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
}