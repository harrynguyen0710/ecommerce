const { prisma } = require("../configs/prisma");

const { createDiscount } = require("../repositories/discount.repository");

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
}

module.exports = new DiscountService();
