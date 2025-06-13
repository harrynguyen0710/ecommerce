const { getConnectedProducer } = require("../configs/producer");

const topics = require("../topics");

async function emitDiscountRejected({}) {
  const producer = await getConnectedProducer();

  await producer.send({
    topic: topics.DISCOUNT_REJECT,
    messages: [
      {
        value: JSON.stringify({
          orderId,
          userId,
          applied,
          reason,
        }),
      },
    ],
  });
  
  console.log(`📤 Emitted discount.rejected for order ${orderId}`);
}

module.exports = emitDiscountRejected;
