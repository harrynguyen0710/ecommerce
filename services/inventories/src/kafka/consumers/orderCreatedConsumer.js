const kafka = require("../../config/kafka");

const inventoryService = require("../../services/inventory.service");

const { GROUP_CONSUMERS } = require("../../constants/index");

const topics = require("../topics");

const consumer = kafka.consumer({ groupId: GROUP_CONSUMERS.INVENTORY_GROUP });

async function orderCreatedConsumer() {
  await consumer.connect();
  await consumer.subscribe({
    topic: topics.ORDER_CREATED,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { orders } = JSON.parse(message.value.toString());
      console.log("orders::", orders);
      try {
        await inventoryService.confirmOrder(orders.items);
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
