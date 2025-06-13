const kafka = require("../../configs/kafka");

const { CONSUMER_GROUP } = require("../../constants/index");

const topics = require("../topics");

const cartUnlockEvent = require("../events/cartUnlockEvent");

async function orderCancelledConsumer() {
  const consumer = kafka.consumer({ groupId: CONSUMER_GROUP.CART });

  await consumer.connect();
  await consumer.subscribe({ topic: topics.CART_UNLOCK, fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { userId } = JSON.parse(message.value.toString());

      await cartUnlockEvent(userId);
    },
  });
}

module.exports = orderCancelledConsumer;
