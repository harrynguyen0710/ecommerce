async function findActiveByCode(tx, code) {
    const discount = await tx.discount.findUnique({
        where: { code },
    });

    return discount;
}


async function incrementByUsage(tx, discountId) {
    await tx.discount.update({
        where: { id: discountId },
        data: { usageCount: { increment: 1 } },
    });
}

async function decrementByUsage(tx, discountId) {
    await tx.discount.update({
        where: { id: discountId },
        data: { usageCount: { decrement: 1 } },
    });
}

async function upsertIncrement(tx, discountId, userId) {
    await tx.discountUsage.upsert({
        where: {
            discountId_userId: {
                discountId,
                userId,
            },
        },
        create: {
            discountId,
            userId,
            usageCount: 1,
            lastUsedAt: new Date(),
        },
        update: {
            usageCount: { increment: 1 },
            lastUsedAt: new Date(),
        }
    });
}

async function upsertDecrement(tx, discountId, userId) {
    await tx.discountUsage.update({
        where: {
            discountId_userId: {
                discountId,
                userId,
            },
        },
        data: {
            usageCount: { decrement: 1 },
            lastUsedAt: new Date(),
        },
    });
}

async function findUsageLog(tx, orderId, code, type) {
    const log = await tx.discountUsageLog.findUnique({
        where: {
            orderId_code_type: {
                orderId,
                code,
                type,
            },
        },
    });

    return log;
}

async function createUsageLog(tx, data) {
    await tx.discountUsageLog.create({
        data,
    });
}

module.exports ={
    findActiveByCode,
    incrementByUsage,
    upsertIncrement,
    findUsageLog,
    createUsageLog,
    decrementByUsage,
    upsertDecrement,
    
}