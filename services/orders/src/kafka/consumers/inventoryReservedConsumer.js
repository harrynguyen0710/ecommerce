const kafka = require("../../configs/kafka");

const topics = require("../topic");

const handleOrderRequestSuccessful = require("../events/handleOrderRequestSuccessful");

const { CONSUMER_GROUP } = require("../../constants/index");

const consumer = kafka.consumer({ groupId: CONSUMER_GROUP.ORDER_CREATED });

async function inventoryReseveSuccessfulConsumser() {
  await consumer.connect();
  await consumer.subscribe({
    topic: topics.ORDER_INVENTORY_RESERVE,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());
      
      console.log("payload::", payload);

      try {
        await handleOrderRequestSuccessful(payload);
      } catch (error) {
        console.error("Error happened when creating an order");
      }
    },
  });
}

module.exports = inventoryReseveSuccessfulConsumser;
