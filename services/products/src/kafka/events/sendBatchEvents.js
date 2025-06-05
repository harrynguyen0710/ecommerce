const { getConnectedProducer } = require("../producerManager");
const { groupByTopic } = require("../utils/messageBuilder");


async function sendBatchEvents (events, sourceService) {
    const producer = await getConnectedProducer();

    const topicMessages = groupByTopic(events, sourceService);

    await producer.sendBatch({
        topicMessages
    });
}

async function sendBatchMessages (payload, topic) {
    const producer = await getConnectedProducer();

    await producer.sendBatch({
        topic,
        messages: payload.map((item) => ({
            value: JSON.stringify(item),
        }))
    });
}



module.exports = { sendBatchEvents, sendBatchMessages };
