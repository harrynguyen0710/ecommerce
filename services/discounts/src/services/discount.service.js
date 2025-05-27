const { prisma } = require("../configs/prisma");

const { createDiscount, findByCode, findAll, updateInfoByCode, updateApplicableSkus, } = require("../repositories/discount.repository");

const validateDiscountInput = require("../utils/validateDiscountInput");

class DiscountService {
  async createDiscount(payload) {
    try {
      const { start, end } = validateDiscountInput(payload);

      const discount = await createDiscount(payload, start, end);

      if (!discount) {
        throw new Error("Failed to create discount");
      }

      return discount;

    } catch (error) {
      if (error.code === "P2002" && error.meta?.target?.includes("code")) {
        throw new Error("Discount code already exists (conflict)");
      }
      throw new Error("Failed to create discount: " + error.message);
    }
  }

  async getAllDiscounts() {
    console.log("Fetching all discounts 2");
    return findAll();
  }

  async getDiscountByCode(code) {
    return await findByCode(code);
  };

  async updateDiscountByCode(code, payload) {
    const existing = findByCode(code);
    
    if (!existing) {
      throw new Error("Discount not found 6");
    }

    return updateInfoByCode(code, payload);
  }

  async updateApplicableSkus(code, skus) {
    const existing = await findByCode(code);
    
    if (!existing) {
      throw new Error("Discount not found 7");
    }

    return updateApplicableSkus(code, skus);
  }
}

module.exports = new DiscountService();
