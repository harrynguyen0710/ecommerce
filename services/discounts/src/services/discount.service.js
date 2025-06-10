const { prisma } = require("../configs/prisma");

const scope = require("../enum/scope");
const type = require("../enum/type");

const {
  createDiscount,
  findByCode,
  findAll,
  updateInfoByCode,
  updateApplicableSkus,
  getDiscountWithUsage,
} = require("../repositories/discount.repository");

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
    const discounts = await findAll();

    if (!discounts) {
      throw new Error("Discounts not found");
    }

    return discounts;
  }

  async getDiscountByCode(code) {
    const discount = await findByCode(code);

    if (!discount) {
      throw new Error("Discount not found");
    }

    return discount;
  }

  async updateDiscountByCode(code, payload) {
    const existing = findByCode(code);

    if (!existing) {
      throw new Error("Discount not found");
    }

    return updateInfoByCode(code, payload);
  }

  async updateApplicableSkus(code, skus) {
    const existing = await findByCode(code);

    if (!existing) {
      throw new Error("Discount not found");
    }

    return updateApplicableSkus(code, skus);
  }

  async validateAndApplyDiscount({
    userId,
    appliedVouchers = [],
    cartItems = [],
    totalAmount,
  }) {
    const now = new Date();
    const usedSkus = new Set();

    let cartLevelVoucherApplied = false;

    let totalDiscountAmount = 0;

    const results = [];

    for (const voucher of appliedVouchers) {
      const { code } = voucher;

      const discount = await getDiscountWithUsage(code, userId);

      if (!discount || !discount.isActive) {
        throw new Error({
          success: false,
          message: `Voucher "${code}" is inactive or invalid.`,
        });
      }

      if (discount.startDate > now || discount.endDate < now) {
        throw new Error({
          success: false,
          message: `Voucher "${code}" is not currently valid.`,
        });
      }

      if (discount.maxUsage && discount.usageCount >= discount.maxUsage) {
        throw new Error({
          success: false,
          message: `Voucher "${code}" usage limit reached.`,
        });
      }

      const usage = discount.usages[0];
      if (
        discount.perUserLimit &&
        usage &&
        usage.usageCount >= discount.perUserLimit
      ) {
        throw new Error({
          success: false,
          message: `You've used voucher "${code}" too many times.`,
        });
      }

      let eligibleAmount = 0;

      if (discount.scope === scope.ENTIRE_ORDER) {
        if (cartLevelVoucherApplied) {
          throw new Error({
            success: false,
            message: "Only one cart-wide voucher is allowed.",
          });
        }

        cartLevelVoucherApplied = true;
        eligibleAmount = totalAmount;
      } else if (discount.scope === scope.SPECIFIC_SKUS) {
        const allowedSkus = new Set(discount.applicableSkus.map((s) => s.sku));

        const eligibleItems = cartItems.filter((item) => {
          if (!allowedSkus.has(item.sku)) return false;
          if (usedSkus.has(item.sku)) {
            throw new Error(
              `SKU "${item.sku}" is targeted by multiple vouchers.`
            );
          }
          return true;
        });

        eligibleAmount = eligibleItems.reduce(
          (sum, item) => sum + item.priceAtAdd * item.quantity,
          0
        );

        if (eligibleAmount === 0) {
          throw new Error({
            success: false,
            message: `Voucher "${code}" does not apply to any items in your cart.`,
          });
        }

        eligibleItems.forEach((item) => usedSkus.add(item.sku));
      }

      if (discount.minOrderValue && eligibleAmount < discount.minOrderValue) {
        throw new Error({
          success: false,
          message: `Voucher "${code}" requires a minimum of ${discount.minOrderValue}.`,
        });
      }

      let discountAmount = 0;

      if (discount.type === type.FIXED) {
        discountAmount = Math.min(discount.value, eligibleAmount);
      } else if (discount.type === type.PERCENTAGE) {
        discountAmount = (eligibleAmount * discount.value) / 100;
      }

      totalDiscountAmount += discountAmount;

      results.push({
        code,
        scope: discount.scope,
        discountAmount: parseFloat(discountAmount.toFixed(2)),
      });
    }

    const originalTotal = parseFloat(totalAmount.toFixed(2));
    const finalTotal = parseFloat(
      (originalTotal - totalDiscountAmount).toFixed(2)
    );

    return {
      success: true,
      originalTotal,
      totalDiscount: parseFloat(totalDiscountAmount.toFixed(2)),
      finalTotal,
      applied: results,
    };
  }
}

module.exports = new DiscountService();
