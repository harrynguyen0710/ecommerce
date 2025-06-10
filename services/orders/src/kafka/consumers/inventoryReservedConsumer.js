const kafka = require("../../configs/kafka");

const topics = require("../topic");

const { CONSUMER_GROUP } = require("../../constants/index");

const consumer = kafka.consumer({ groupId: CONSUMER_GROUP.ORDER });

async function inventoryFailedConsumser() {
    await consumer.connect();
    await consumer.subscribe({ topic: topics.INVENTORY_FAILED, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ message }) => {
            
        }
    })
}

module.exports = inventoryFailedConsumser;