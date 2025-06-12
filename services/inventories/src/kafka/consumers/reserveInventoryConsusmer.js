const kafka = require("../../config/kafka");

const inventoryService = require("../../services/inventory.service");

const { GROUP_CONSUMERS } = require("../../constants/index");

const topics = require("../topics");

const emitInventoryStatus = require("../producers/emitInventoryStatus");

const consumer = kafka.consumer({ groupId: GROUP_CONSUMERS.INVENTORY_GROUP });

async function reserveInventoryConsumer() {
  await consumer.connect();
  await consumer.subscribe({
    topic: topics.INVENTORY_RESERVE_REQUEST,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());
      console.log("payload::", payload);
      try {
        const {
          userId,
          items,
          discountAmount,
          finalAmount,
          originalTotal,
          validVouchers,
          appliedVouchers,
        } = payload;

        const result = await inventoryService.reserveItems(items);
        
        console.log("result::", result);
        
        await emitInventoryStatus(
          result.success
            ? topics.ORDER_INVENTORY_RESERVE
            : topics.INVENTORY_FAILED,
          {
            items,
            userId,
            discountAmount,
            finalAmount,
            originalTotal,
            validVouchers,
            appliedVouchers,
            ...(result.success ? {} : { reason: result.reason }),
          }
        );
      } catch (error) {
        console.error(
          "Something went wrong during reserving items::",
          error.message
        );
      }
    },
  });
}

module.exports = reserveInventoryConsumer;
