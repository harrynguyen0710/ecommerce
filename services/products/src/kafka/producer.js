const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'product-service',
    brokers: [process.env.KAFKA_BROKER],
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

