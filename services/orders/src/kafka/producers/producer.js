const kafka = require("../../configs/kafka");

const retry = require("../kafkaRetryConfig")

let connectedProducer = null;


async function getProducer() {
    if (!connectedProducer) {
        connectedProducer = kafka.producer({ retry });
        await connectedProducer.connect();
        
        console.log('Kafka producer connected (order-service)');
    }

    return connectedProducer;
}

module.exports = getProducer;
