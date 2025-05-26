const kafka = require('../configs/kafka');

const producer = kafka.producer();

async function connectProducer() {
    await producer.connect();
    console.log('Kafka producer connected');
}

module.exports = {
    producer,
    connectProducer,
}