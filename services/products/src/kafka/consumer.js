const kafka = require('../configs/kafka');

const KAFKA_CONSUMER_GROUP = process.env.KAFKA_CONSUMER_GROUP;

const consumer = kafka.consumer({
    groupId: KAFKA_CONSUMER_GROUP,
});

module.exports = consumer;

