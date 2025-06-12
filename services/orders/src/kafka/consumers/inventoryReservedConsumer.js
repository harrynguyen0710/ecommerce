const kafka = require("../../configs/kafka");

const topics = require("../topic");

const orderService = require("../../services/order.service");

const sendOrderCreatedEvent = require("../events/sendOrderCreatedEvent");

const sendOrderCreatedFailEvent = require("../events/sendOrderCreatedFailEvent");

const emitUnlockCartEvent = require("../producers/emitUnlockCartEvent");

const { CONSUMER_GROUP } = require("../../constants/index");

const consumer = kafka.consumer({ groupId: CONSUMER_GROUP.ORDER });

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
        const { discountAmount, finalAmount, appliedVouchers, items, userId } =  payload;

        const order = await orderService.createNewOrder(
          discountAmount,
          finalAmount,
          appliedVouchers,
          items,
          userId
        );

        console.log("order::", order);

        if (order) {
          console.log("sent1");
          await sendOrderCreatedEvent(order);
        } else {
          console.log("sent2");
          await sendOrderCreatedFailEvent(cartItems);
        }

        await emitUnlockCartEvent(userId);
      } catch (error) {
        console.error("Error happened when creating an order");
      }
    },
  });
}

module.exports = inventoryReseveSuccessfulConsumser;
