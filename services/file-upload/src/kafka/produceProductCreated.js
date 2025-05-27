const { producer } = require('./producer');

async function produceProductCreated(payload) {
  await producer.send({
    topic: 'product.bulk.created',
    messages: [
      {
        value: JSON.stringify(payload),
      },
    ],
  });

  const skus = payload?.variants?.map((v) => v.sku).join(", ") || "no variants";
  console.log(`📨 Kafka message sent for SKU(s): ${skus}`);
}

module.exports = {
  produceProductCreated,
};
