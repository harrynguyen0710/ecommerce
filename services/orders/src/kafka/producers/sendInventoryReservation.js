const topics = require("../topic");

const { getProducer } = require("../configs/producer");


async function publishInventoryReservation({ correlationId, userId, items, meta }) {
    const producer = await getProducer();

    const message = {
        userId,
        items, 
        discountAmount: meta.discountAmount,
        finalAmount: meta.finalAmount,
        originalTotal: meta.originalTotal,
        validVouchers: meta.validVouchers,
        appliedVouchers: meta.appliedVouchers,
    };

    await producer.send({
        topic: topics.INVENTORY_RESERVE_REQUEST,
        messages: [
            {
                value: JSON.stringify(message),
            }
        ]
    });

    console.log(`Sent inventory.reserve.request for user ${userId}`);

}

module.exports = publishInventoryReservation;
