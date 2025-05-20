const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'product-service',
    brokers: ['localhost:9092'],
});

const kafkaProducer = kafka.producer();

async function connectProducer() {
    await kafkaProducer.connect();
    console.log('✅ Kafka Producer connected');
}


module.exports = {
    kafkaProducer,
    connectProducer,
};

