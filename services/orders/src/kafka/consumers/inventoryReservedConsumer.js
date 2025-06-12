const kafka = require("../../configs/kafka");

const topics = require("../topic");

const orderService = require("../../services/order.service");

const sendOrderCreatedEvent = require("../events/sendOrderCreatedEvent");

const sendOrderCreatedFailEvent = require("../events/sendOrderCreatedFailEvent");

const emitUnlockCartEvent = require("../producers/emitUnlockCartEvent");

const { CONSUMER_GROUP } = require("../../constants/index");


const consumer = kafka.consumer({ groupId: CONSUMER_GROUP.ORDER });

async function inventoryReseveSuccessflConsumser() {
    await consumer.connect();
    await consumer.subscribe({ topic: topics.ORDER_INVENTORY_RESERVE, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const payload = JSON.parse(message.value.toString());
            
            const { totalDiscount, finalTotal, appliedVoucher, cartItems, userId } = payload
            
            console.log("payload::", payload);

            const order = await orderService.createNewOrder(totalDiscount, finalTotal, appliedVoucher, cartItems, userId);
            
            console.log("order::", order);

            if (order) {
                await sendOrderCreatedEvent(order);
            } else {
                await sendOrderCreatedFailEvent(cartItems);
            }

            await emitUnlockCartEvent(userId);

        }
    });
}

module.exports = inventoryReseveSuccessflConsumser;