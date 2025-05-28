const { producer } = require('./producer');


async function produceProductCreated(payload, headers = {}) {
    await producer.send({
        topic: 'product.bulk.created',
        messages: [{
            value: JSON.stringify(payload),
            headers,
        }],
    })
}

module.exports = {
    produceProductCreated,
};