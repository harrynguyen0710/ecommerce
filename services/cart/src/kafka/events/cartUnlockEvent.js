const cartSerive = require("../../services/cart.service");

async function cartUnlockEvent(userId) {
  try {
    await cartSerive.unlockCart(userId);
    console.log("Unlocked cart successfully");
  } catch (error) {
    console.error(`Failed to unlock cart for ${userId}:`, error.message);
  }
}

module.exports = cartUnlockEvent;
