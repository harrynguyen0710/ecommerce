const kafka = require("../../configs/kafka");

const retry = require("./kafkaRetryConfig");

const producer = kafka.producer({
  retry,
});

async function connectProducer() {
  await producer.connect();
  console.log("Kafka producer connected");
}

module.exports = {
  producer,
  connectProducer,
};
