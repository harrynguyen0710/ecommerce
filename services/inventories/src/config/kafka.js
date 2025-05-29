const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'inventory-service',
    brokers: [process.env.KAFKA_BROKERS || 'kafka:9092']
});

const producer = kafka.producer();


module.exports = { kafka, producer }