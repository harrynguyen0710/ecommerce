const Cart = require("../models/cart.model");

async function getCartByUserId(userId) {
    return Cart.findOne({ userId }).lean();
}

async function updateCartByUserId(userId, cartData) {
    const updated = await Cart.findOneAndUpdate(
        { userId },
        { $set: cartData },
        { new: true, upsert: true, },
    ).lean();

    return updated;
}

async function deleteCartByUserId(userId) {
    await Cart.deleteOne({ userId });
}

module.exports = {
    getCartByUserId,
    updateCartByUserId,
    deleteCartByUserId,
}