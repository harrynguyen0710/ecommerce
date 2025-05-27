const { Kafka } = require('kafkajs');

const CLIENT_ID = process.env.KAFKA_CLIENT_ID;
const BROKERS = process.env.BROKER;

const kafka = new Kafka({
    clientId: CLIENT_ID,
    brokers: [BROKERS]
});

module.exports = kafka;