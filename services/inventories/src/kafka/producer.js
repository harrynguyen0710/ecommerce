const kafka = require("../config/kafka");

const retry = require("./kafkaRetryConfig");

let connectedProducer = null;

async function getConnectedProducer() {
    if (!connectedProducer) {
        const producer = kafka.producer({ retry });
        await producer.connect();

        connectedProducer = producer;

        console.log("✅ Kafka producer connected");
    }
}

module.exports = { 
    getConnectedProducer,
}