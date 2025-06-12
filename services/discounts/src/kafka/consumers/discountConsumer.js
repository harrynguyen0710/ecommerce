const kafka = require("../../configs/kafka");

const topics = require("../topics");

const { CONSUMER_GROUP } = require("../../constants/index");

const handleDiscountApplied = require("../handlers/handleDiscountApplied");
const handleDiscountRollback = require("../handlers/handleDiscountRollback");


const consumer = kafka.consumer({ groupId: CONSUMER_GROUP.DISCOUNT });

async function startDiscountConsumer() {
    await consumer.connect();

    await consumer.subscribe({ topic: topics.ORDER_CREATED, fromBeginning: false });
    // await consumer.subscribe({ topic: topics.ORDER_FAILED, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            try {
                if (topic === topics.ORDER_CREATED) {
                    await handleDiscountApplied(message);
                } else if (topic === topics.ORDER_FAILED) {
                    await handleDiscountRollback(message);
                }
            } catch (error) {
                console.error(`❌ Error handling message from topic ${topic}:`, error);
            }
        },
    });

    console.log("🚀 Discount Kafka consumer running");

}

module.exports = startDiscountConsumer;