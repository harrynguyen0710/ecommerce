const kafka = require("../../configs/kafka");

const { CONSUMER_GROUP } = require("../../constants/index");

const topics = require("../topics");

const orderCreatedEvent = require("../events/orderCreatedEvent");

async function orderCreateConsumer() {
    const consumer = kafka.consumer({ groupId: CONSUMER_GROUP.CLEAN_CART });

    await consumer.connect();
    await consumer.subscribe({ topic: topics.ORDER_CREATED, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const { userId } = JSON.parse(message.value.toString());
            
            await orderCreatedEvent(userId);

        }
    });

}

module.exports = orderCreateConsumer;