const { prisma } = require("../configs/prisma");
const { v4: uuidv4 } = require("uuid");
const { getSkusByProductID } = require("../../clients/inventory.client");

const handleUndefinedFields = require("../utils/handleUndefinedFields");

const createDiscount = async (payload, start, end) => {
  const {
    code,
    type,
    value,
    minOrderValue,
    applicableSkus = [],
    applicableProductIds = [],
    maxUsage,
    usageCount,
    perUserLimit,
  } = payload;

  const isDuplicate = await prisma.discount.findFirst({
    where: {
      code,
    },
  });

  if (isDuplicate) {
    throw new Error("Discount code already exists");
  }

  // sku
  let finalSkus = [...applicableSkus];

  if (applicableProductIds.length > 0) {
    const skuResponse = await getSkusByProductID(applicableProductIds);
    const productSkus = skuResponse.skus.map((entry) => entry.sku);
    finalSkus = [...new Set([...finalSkus, ...productSkus])];
  }

  const discount = await prisma.discount.create({
    data: {
      id: uuidv4(),
      code,
      type,
      value,
      startDate: start,
      endDate: end,
      minOrderValue,
      applicableSkus: {
        create: applicableSkus.map((sku) => ({
          sku: sku,
        })),
      },
      maxUsage,
      usageCount: usageCount || 0,
      perUserLimit,
    },
  });

  return discount;
};

const findAll = async () => {
  
  const discounts = await prisma.discount.findMany({
    include: {
      applicableSkus: true,
      usages: true,
    },
  });

  return discounts;
};

const findByCode = async (code) => {
  const discount = await prisma.discount.findUnique({
    where: {
      code: code,
    },
    include: {
      applicableSkus: true,
      usages: true,
    },
  });

  if (!discount) {
    throw new Error("Discount not found 4");
  }

  return discount;
};

const updateInfoByCode = async (code, payload) => {
  const data = handleUndefinedFields(payload);

  const updated = await prisma.discount.update({
    where: {
      code: code,
    },
    data,
    include: {
      applicableSkus: true,
      usages: true,
    },
  });

  if (!updated) {
    throw new Error("Failed to update discount");
  }

  return updated;
};

const updateApplicableSkus = async (code, { add = [], remove = []}) => {
  const discount = await prisma.discount.findUnique({
    where: {
      code: code,
    }
  });

  if (!discount) {
    throw new Error("Discount not found");
  }

  const tx = [];

  if (remove.length) {
    tx.push(prisma.discountApplicableSku.deleteMany({
      where: {
        discountId: discount.id,
        sku: {
          in: remove,
        }
      }
    }));
  }

  if (add.length) {
    tx.push(prisma.discountApplicableSku.createMany({
      data: add.map(sku => ({
        sku,
        discountId: discount.id,
      })),
      skipDuplicates: true,
    }));
  }

  if (tx.length) await prisma.$transaction(tx);

  return prisma.discount.findUnique({
    where: {
      code: code,
    },
    include: {
      applicableSkus: true,
      usages: true,
    },
  });

}

const getDiscountWithUsage = async (code, userId) => {
  const discount = await prisma.discount.findUnique({
    where: { code },
    include: {
      usages: {
        where: { userId },
        take: 1,
      },
    },
  });

  return discount;
}


module.exports = {
  createDiscount,
  findByCode,
  findAll,
  updateInfoByCode,
  updateApplicableSkus,
  getDiscountWithUsage,
};
