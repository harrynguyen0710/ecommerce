const kafka = require("../configs/kafka");
const retry = require("./kafkaRetryConfig");

let connectedProducer = null;
let connectingPromise = null;

async function getConnectedProducer() {
  if (connectedProducer) return connectedProducer;

  if (!connectingPromise) {
    connectingPromise = (async () => {
      
      const producer = kafka.producer({
        retry,
        idempotent: true,
        maxInFlightRequests: 1,
        maxRequestSize: 5 * 1024 * 1024, // 5MB
        allowAutoTopicCreation: false,
      });

      await producer.connect();
      connectedProducer = producer;
      console.log("✅ Kafka producer connected");
      return producer;
    })();
  }

  return connectingPromise;
}

module.exports = {
  getConnectedProducer,
};
