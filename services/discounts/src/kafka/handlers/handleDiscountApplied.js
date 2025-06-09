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
    orderId,
    userId,
    applied = [],
  } = JSON.parse(message.value.toString());

  try {
    await prisma.$transaction(async (tx) => {
      for (const voucher of applied) {
        const { code } = voucher;

        const alreadyLogged = await findUsageLog(tx, orderId, code, status.APPLIED);

        if (alreadyLogged) {
          console.log(
            `🔁 Skipping duplicate application for order ${orderId}, code ${code}`
          );
          continue;
        }

        const discount = await findActiveByCode(tx, code);

        if (!discount || !discount.isActive) {
          throw new Error(`Voucher "${code}" is invalid or inactive`);
        }

        await incrementByUsage(tx, discount.id);
        await upsertIncrement(tx, discount.id, userId);

        await createUsageLog(tx, { orderId, code, userId, type: status.APPLIED });
      }
    });
    console.log(`✅ Committed usage for order ${orderId}`);
  } catch (error) {
    console.error(
      `❌ Failed to apply discount for order ${orderId}:`,
      err.message
    );

    await emitDiscountRejected({
      orderId,
      userId,
      applied,
      reason: error.message,
    });
  }
}

module.exports = handleDiscountApplied;
