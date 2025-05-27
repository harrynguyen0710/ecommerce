const { producer } = require('./producer');


async function produceProductCreated(payload) {
    await producer.send({
        topic: 'product.bulk.created',
        messages: [{
            value: JSON.stringify(payload),
        }],
    })
}

module.exports = {
    produceProductCreated,
};