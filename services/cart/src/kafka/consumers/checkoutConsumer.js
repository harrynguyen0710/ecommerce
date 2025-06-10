const kafka = require("../../configs/kafka");

const CartService = require("../../services/cart.service");

const topics = require("../topics");

const { CONSUMER_GROUP } = require("../../constants/index");

const emitMessage = require("../producers/emitMessage");

async function checkoutConsumer() {
    const consumer = kafka.consumer({ groupId: CONSUMER_GROUP.CART });

    await consumer.connect();
    await consumer.subscribe({ topic: topics.CHECKOUT_STARTED, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const { userId, correlationId } = JSON.parse(message.value.toString());

            try {
                const cart = await CartService.validateAndLockCart(userId);
                
                await emitMessage(topics.CART_LOCKED, { userId, cart, correlationId});

            } catch (error) {
                await emitMessage(topics.CART_LOCK_FAILED, { userId, error: error.message, correlationId });
            }
        }
    })
}

module.exports = checkoutConsumer;
