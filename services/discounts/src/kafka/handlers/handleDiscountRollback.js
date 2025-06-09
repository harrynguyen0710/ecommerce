const prisma = require("../../configs/kafka");

const {
  findUsageLog,
  findActiveByCode,
  createUsageLog,
  decrementByUsage,
  upsertDecrement,
} = require("../../repositories/discount.internal.repository");

const status = require("../../enum/status");

async function handleDiscountRollback(message) {
  const {
    orderId,
    userId,
    applied = [],
  } = JSON.parse(message.value.toString());

  try {
    await prisma.$transaction(async (tx) => {
      for (const voucher of applied) {
        const { code } = voucher;

        const log = await findUsageLog(tx, orderId, code, status.ROLLED_BACK);

        if (log) {
          console.log(
            `🔁 Skipping duplicate rollback for order ${orderId}, code ${code}`
          );
          continue;
        }

        const discount = await findActiveByCode(tx, code);

        if (!discount) {
          console.warn(`⚠️ Discount not found for code ${code}`);
          continue;
        }

        await decrementByUsage(tx, discount.id);
        
        await upsertDecrement(tx, discount.id, userId);
        
        await createUsageLog(tx, { orderId, code, userId, type: status.ROLLED_BACK})
    
      }
    });
    
    console.log(`🧾 Rolled back usage for order ${orderId}`);
  } catch (error) {
    console.error(`❌ Failed to rollback discount for order ${orderId}:`, err.message);

  }
}

module.exports = handleDiscountRollback;
