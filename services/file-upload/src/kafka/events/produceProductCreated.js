const { producer } = require("../producer");

const TOPICS = require('../topics');


async function produceProductCreated(payload, headers = {}) {
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