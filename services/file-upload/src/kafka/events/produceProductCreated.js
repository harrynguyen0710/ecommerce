const { getConnectedProducer } = require("../producerManager");

const TOPICS = require('../topics');


async function produceProductCreated(payload, headers = {}) {
    const producer = await getConnectedProducer();
    
    await producer.send({
        topic: TOPICS.FILE_PARSED,
        messages: [{
            value: JSON.stringify(payload),
            headers,
        }],
    })
}

module.exports = {
    produceProductCreated,
};