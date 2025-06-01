const kafka = require("../configs/kafka");
const retry = require("./kafkaRetryConfig");

let connectedProducer = null;
let connectingPromise = null;

async function getConnectedProducer() {
  if (connectedProducer) return connectedProducer;

  if (!connectingPromise) {
    connectingPromise = (async () => {
      const producer = kafka.producer({ retry });
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
