const kafka = require("../../config/kafka");

const inventoryService = require("../../services/inventory.service");

const { GROUP_CONSUMERS } = require("../../constants/index");

const topics = require("../topics");

const consumer = kafka.consumer({ groupId: GROUP_CONSUMERS.INVENTORY_GROUP });

async function orderRevertConsumer() {
  await consumer.connect();
  await consumer.subscribe({
    topic: topics.ORDER_FAILED,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { cartItems } = JSON.parse(message.value.toString());
      console.log("cart items::", cartItems);
      try {
        await inventoryService.revertReserve(cartItems);
      } catch (error) {
        console.log(
          "Something went wrong during reverting inventories::",
          error.message
        );
      }
    },
  });
}

module.exports = orderRevertConsumer;
