const buildKafkaHeaders = require("./buildKafkaHeaders");

function buildKafkaMessage (event, sourceService) {
    const headers = buildKafkaHeaders(event, sourceService);

    return {
        topic: event.eventType,
        messages: [
            {
                key: event.payload.productId,
                value: JSON.stringify(event.payload),
                headers,
            },
        ],
    };
}

function groupByTopic(events, sourceService) {
    const grouped = {};

    for (const event of events) {
        const topic = event.eventType;

        console.log('topic::', event.eventType);

        const message = {
            key: event.payload.productId,
            value: JSON.stringify(event.payload),
            headers: buildKafkaHeaders(event, sourceService),
        };

        if (!grouped[topic]) {
            grouped[topic] = [];
        }

        grouped[topic].push(message);
    }

    return Object.entries(grouped).map(([topic, messages]) => ({
        topic,
        messages,
    }))

}

module.exports = {
    buildKafkaMessage,
    groupByTopic,
}