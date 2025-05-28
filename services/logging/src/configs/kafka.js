const { Kafka } = require('kafkajs');

const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID;
const KAFKA_BROKER = process.env.KAFKA_BROKER;

const kafka = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: [KAFKA_BROKER],
});

module.exports = kafka;
