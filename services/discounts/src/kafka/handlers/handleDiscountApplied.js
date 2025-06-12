const {
  findActiveByCode,
  incrementByUsage,
  upsertIncrement,
  findUsageLog,
  createUsageLog,
} = require("../../repositories/discount.internal.repository");

const {prisma} = require("../../configs/prisma");

const status = require("../../enum/status");

const emitDiscountRejected = require("../producers/emitDiscountReject");

async function handleDiscountApplied(message) {
  console.log("payload:: ", JSON.parse(message.value.toString()));
  
  const order = JSON.parse(message.value.toString());
  const applied = order.appliedDiscounts;
  try {
    await prisma.$transaction(async (tx) => {

      for (const voucher of applied) {
        const { discountCode } = voucher;

        const alreadyLogged = await findUsageLog(tx, order.id, discountCode, status.APPLIED);

        if (alreadyLogged) {
          console.log(
            `🔁 Skipping duplicate application for order ${order.id}, code ${discountCode}`
          );
          continue;
        }

        const discount = await findActiveByCode(tx, discountCode);

        if (!discount || !discount.isActive) {
          throw new Error(`Voucher "${discountCode}" is invalid or inactive`);
        }

        await incrementByUsage(tx, discount.id);
        await upsertIncrement(tx, discount.id, order.userId);

        await createUsageLog(tx, { orderId: order.id, code: discountCode, userId: order.userId, type: status.APPLIED });
      }
    });
    console.log(`✅ Committed usage for order ${order.id}`);
  } catch (error) {
    console.error(
      `❌ Failed to apply discount for order ${order.id}:`,
      error.message
    );

    await emitDiscountRejected({
      orderId: order.id,
      userId: order.userId,
      applied,
      reason: error.message,
    });
  }
}

module.exports = handleDiscountApplied;
