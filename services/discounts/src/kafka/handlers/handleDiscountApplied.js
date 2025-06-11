const {
  findActiveByCode,
  incrementByUsage,
  upsertIncrement,
  findUsageLog,
  createUsageLog,
} = require("../../repositories/discount.internal.repository");

const prisma = require("../../configs/prisma");

const status = require("../../enum/status");

const emitDiscountRejected = require("../producers/emitDiscountReject");

async function handleDiscountApplied(message) {
  const {
    order
  } = JSON.parse(message.value.toString());
  console.log("payload:: ", JSON.parse(message.value.toString()));
  const applied = order.appliedDiscounts;
  try {
    await prisma.$transaction(async (tx) => {
      for (const voucher of applied) {
        const { code } = voucher;

        const alreadyLogged = await findUsageLog(tx, order.orderId, code, status.APPLIED);

        if (alreadyLogged) {
          console.log(
            `🔁 Skipping duplicate application for order ${order.orderId}, code ${code}`
          );
          continue;
        }

        const discount = await findActiveByCode(tx, code);

        if (!discount || !discount.isActive) {
          throw new Error(`Voucher "${code}" is invalid or inactive`);
        }

        await incrementByUsage(tx, discount.id);
        await upsertIncrement(tx, discount.id, userId);

        await createUsageLog(tx, { orderId: order.orderId, code, userId, type: status.APPLIED });
      }
    });
    console.log(`✅ Committed usage for order ${order.orderId}`);
  } catch (error) {
    console.error(
      `❌ Failed to apply discount for order ${order.orderId}:`,
      err.message
    );

    await emitDiscountRejected({
      orderId: order.orderId,
      userId,
      applied,
      reason: error.message,
    });
  }
}

module.exports = handleDiscountApplied;
