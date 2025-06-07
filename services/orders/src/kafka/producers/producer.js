const kafka = require("../../configs/kafka");

let connectedProducer;


async function getProducer() {
    if (!connectedProducer) {
        connectedProducer = kafka.producer();
        await connectedProducer.connect();
        
        console.log('Kafka producer connected (order-service)');
    }

    return connectedProducer;
}

module.exports = getProducer();
