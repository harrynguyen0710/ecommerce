const { Kafka, logLevel } = require("kafkajs");

const retry = require("../kafka/kafkaRetryConfig");

const CLIENT_ID = process.env.KAFKA_CLIENT_ID;
const BROKERS = process.env.KAFKA_BROKER;

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: [BROKERS],
  logLevel: logLevel.ERROR,
  logCreator:
    (level) =>
    ({ namespace, label, log }) => {
      console.log(`[${label}] ${namespace} - ${log.message}`, log);
    },
  retry,
});

module.exports = kafka;
