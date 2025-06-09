const kafka = require("../../config/kafka");

const inventoryService = require("../../services/inventory.service");

const { GROUP_CONSUMERS } = require("../../constants/index");

const topics = require("../topics");

const emitInventoryStatus = require("../producers/emitInventoryStatus");

const consumer = kafka.consumer({ groupId: GROUP_CONSUMERS.INVENTORY_GROUP });

async function reserveInventoryConsumer() {
    await consumer.connect();
    await consumer.subscribe({ topic: topics.INVENTORY_RESERVED, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            const payload = JSON.parse(message.value.toString());
            const { orderId, items, correlationId } = payload;

            const result = await inventoryService.reserveItems(items);
            
            await emitInventoryStatus(
                result.success ? topics.INVENTORY_RESERVED : topics.INVENTORY_FAILED,
                {
                    orderId,
                    items,
                    correlationId,
                    ...(result.success ? {} : { reason: result.reason }),
                }
            );
        }
    });
}

module.exports = reserveInventoryConsumer;