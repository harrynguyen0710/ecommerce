const kafka = require("../../config/kafka");

const inventoryService = require("../../services/inventory.service");

const { GROUP_CONSUMERS } = require("../../constants/index");

const topics = require("../topics");

const consumer = kafka.consumer({ groupId: GROUP_CONSUMERS.INVENTORY_UPDATE_ORDER_CREATED });

async function orderCreatedConsumer() {
  await consumer.connect();
  await consumer.subscribe({
    topic: topics.ORDER_CREATED,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());

      try {
        await inventoryService.confirmOrder(payload.items);
      } catch (error) {
        console.error(
          "Something went wrong during confirming order::",
          error.message
        );
      }
    },
  });
}

module.exports = orderCreatedConsumer;
