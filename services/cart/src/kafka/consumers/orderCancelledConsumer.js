const kafka = require("../../configs/cartRedis");

const cartSerive = require("../../services/cart.service");

const { CONSUMER_GROUP } = require("../../constants/index");

const topics = require("../topics");

async function orderCancelledConsumer () {
    const consumer = kafka.consumer({ groupId: CONSUMER_GROUP.CART });

    await consumer.connect();
    await consumer.subscribe({ topic: topics.CART_UNLOCK, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const { userId } = JSON.parse(message.value.toString());
            console.log("userId::", userId)
            try {
                await cartSerive.unlockCart(userId);
                console.log("Unlocked cart successfully");
            } catch (error) {   
                console.error(`Failed to unlock cart for ${userId}:`, error.message);
            }
        }
    })

}

module.exports = orderCancelledConsumer