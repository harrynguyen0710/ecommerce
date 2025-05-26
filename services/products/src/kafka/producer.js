const kafka = require('./kafkaClient');

const kafkaProducer = kafka.producer();

async function connectProducer() {
    await kafkaProducer.connect();
    console.log('✅ Kafka Producer connected');
}


module.exports = {
    kafkaProducer,
    connectProducer,
};

