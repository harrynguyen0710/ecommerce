const kafka = require("../../configs/kafka");

const { CONSUMER_GROUP } = require("../../constants/index");

const topics = require("../topics");

const cartService = require("../../services/cart.service");

async function orderCreateConsumer() {
    const consumer = kafka.consumer({ groupId: CONSUMER_GROUP.CART });

    await consumer.connect();
    await consumer.subscribe({ topic: topics.CART_CREATED, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const { userId, orderId } = JSON.parse(message.value.toString());

            try {
                await cartService.cleanCart(userId);
                console.log("Cleared cart successfully");
            } catch (error) {
                console.error(`Failed to clear cart for ${userId}:`, error.message);
            }
        }
    });

}

module.exports = orderCreateConsumer;