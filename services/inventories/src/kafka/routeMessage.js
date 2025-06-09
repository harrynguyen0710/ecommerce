const  handleProductCreated  = require("./events/productCreatedHandler");


const topics = require("./topics");

function routeMessage(topic, payload, meta) {
    switch (topic) {
        case topics.PRODUCT_CREATED:
            return handleProductCreated(payload, meta);
        default:
            throw new Error(`No handler for topic: ${topic}`);
    }
}

module.exports = { routeMessage };
