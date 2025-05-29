const kafka = require('../configs/kafka');
const updateMetric = require('../services/metricsAggregator');

const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID;

async function startKafkaConsumer() {
    const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID });

    await consumer.connect();
    await consumer.subscribe({
        topic: /^metrics\..*/,
        fromBeginning: true,
    });

    await consumer.run({
        eachMessage: async ({ topic, message }) => {
            
            try {
                const payload = JSON.parse(message.value.toString());
                
                console.log(`📥 Consumed metric from ${topic}:`, payload);
                
                const { service, event, latencyMs, recordCount, timestamp } = payload;
                
                if (service && event && typeof latencyMs === 'number' && typeof recordCount === 'number') {
                    updateMetric({
                        service,
                        event,
                        latencyMs,
                        recordCount,
                        timestamp: timestamp || new Date().toISOString(),
                    });
                } else {
                    console.warn('🚨 Invalid metric payload:', payload);
                }

            } catch (error) {
                console.error('❌ Failed to process Kafka message:', error);

            }
        }
    })

}

module.exports = startKafkaConsumer;