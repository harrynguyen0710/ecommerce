const { Kafka } = require('kafkajs');

const KAFKA_BROKERS = process.env.KAFKA_BROKERS;
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID;

const kafka = new Kafka({
    clientId: KAFKA_CLIENT_ID,
    brokers: [KAFKA_BROKERS]
});

module.exports = kafka;