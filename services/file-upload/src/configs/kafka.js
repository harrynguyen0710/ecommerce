const { Kafka } = require("kafkajs");

const CLIENT_ID = process.env.KAFKA_CLIENT_ID;
const BROKERS = process.env.BROKER;

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: [BROKERS],
  retry: {
    initialRetryTime: 300,
    retries: 8,
    factor: 0.2,
    multiplier: 2,
    maxRetryTime: 30_000,
  },
});

module.exports = kafka;
