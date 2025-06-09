const kafka = require("../../configs/kafka");

const topics = require("../topics");

const { CONSUMER_GROUP } = require("../../constants/index");

const handleDiscountApplied = require("../handlers/handleDiscountApplied");
const handleDiscountRollback = require("../handlers/handleDiscountRollback");


const consumer = kafka.consumer({ groupId: CONSUMER_GROUP.DISCOUNT });

async function startDiscountConsumer() {
    await consumer.connect();

    await consumer.subscribe({ topic: topics.DISCOUNT_APPLIED, fromBeginning: false });
    await consumer.subscribe({ topic: topics.DISCOUNT_REJECT, fromBeginning: false });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            try {
                if (topic === topics.DISCOUNT_APPLIED) {
                    await handleDiscountApplied(message);
                } else if (topic === topics.DISCOUNT_ROLLBACK) {
                    await handleDiscountRollback(message);
                }
            } catch (error) {
                console.error(`❌ Error handling message from topic ${topic}:`, err);
            }
        },
    });

    console.log("🚀 Discount Kafka consumer running");

}

module.exports = startDiscountConsumer;