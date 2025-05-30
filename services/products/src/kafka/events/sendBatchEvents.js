const { getConnectedProducer } = require("../producerManager");
const { groupByTopic } = require("../utils/messageBuilder");


async function sendBatchEvents (events, sourceService) {
    const producer = await getConnectedProducer();

    const topicMessages = groupByTopic(events, sourceService);

    await producer.sendBatch({
        topicMessages
    });
}

module.exports = sendBatchEvents;
