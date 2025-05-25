const { prisma } = require("../configs/prisma");
const { v4: uuidv4 } = require("uuid");
const { getSkusByProductID } = require("../../clients/inventory.client");

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
      code: code,
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

module.exports = {
  createDiscount,
};
