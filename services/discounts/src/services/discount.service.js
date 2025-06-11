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
    const results = [];

    const originalTotal = parseFloat(totalAmount.toFixed(2));
    let finalTotal = originalTotal;
    let totalDiscountAmount = 0;

    const bestSkuVoucherMap = new Map();
    let bestCartVoucher = null;
    let bestCartDiscount = 0;

    for (const voucher of appliedVouchers) {
      const { code } = voucher;
      const discount = await getDiscountWithUsage(code, userId);

      // === VALIDATION ===
      if (!discount || !discount.isActive) {
        results.push({
          code,
          success: false,
          message: `Voucher "${code}" is inactive or invalid.`,
        });
        continue;
      }

      if (discount.startDate > now || discount.endDate < now) {
        results.push({
          code,
          success: false,
          message: `Voucher "${code}" is not currently valid.`,
        });
        continue;
      }

      if (discount.maxUsage && discount.usageCount >= discount.maxUsage) {
        results.push({
          code,
          success: false,
          message: `Voucher "${code}" usage limit reached.`,
        });
        continue;
      }

      const usage = discount.usages[0];
      if (
        discount.perUserLimit &&
        usage &&
        usage.usageCount >= discount.perUserLimit
      ) {
        results.push({
          code,
          success: false,
          message: `You've used voucher "${code}" too many times.`,
        });
        continue;
      }

      // === PROCESS ENTIRE ORDER ===
      if (discount.scope === scope.ENTIRE_ORDER) {
        if (discount.minOrderValue && totalAmount < discount.minOrderValue) {
          results.push({
            code,
            success: false,
            message: `Voucher "${code}" requires a minimum of ${discount.minOrderValue}.`,
          });
          continue;
        }

        let discountAmount = 0;
        if (discount.type === type.FIXED) {
          discountAmount = Math.min(discount.value, totalAmount);
        } else if (discount.type === type.PERCENTAGE) {
          discountAmount = (totalAmount * discount.value) / 100;
        }

        discountAmount = parseFloat(discountAmount.toFixed(2));
        if (discountAmount > bestCartDiscount) {
          bestCartVoucher = {
            code,
            scope: discount.scope,
            type: discount.type,
            discountAmount,
          };
          bestCartDiscount = discountAmount;
        }
      }

      // === PROCESS SPECIFIC SKUS ===
      if (discount.scope === scope.SPECIFIC_SKUS) {
        const allowedSkus = new Set(discount.applicableSkus.map((s) => s.sku));
        const eligibleItems = cartItems.filter((item) =>
          allowedSkus.has(item.sku)
        );

        if (eligibleItems.length === 0) {
          results.push({
            code,
            success: false,
            message: `Voucher "${code}" does not apply to any items in your cart.`,
          });
          continue;
        }

        for (const item of eligibleItems) {
          const itemTotal = item.priceAtAdd * item.quantity;
          if (discount.minOrderValue && itemTotal < discount.minOrderValue)
            continue;

          let discountAmount = 0;
          if (discount.type === type.FIXED) {
            discountAmount = Math.min(discount.value, itemTotal);
          } else if (discount.type === type.PERCENTAGE) {
            discountAmount = (itemTotal * discount.value) / 100;
          }
          discountAmount = parseFloat(discountAmount.toFixed(2));

          const existing = bestSkuVoucherMap.get(item.sku);
          if (!existing || discountAmount > existing.discountAmount) {
            bestSkuVoucherMap.set(item.sku, {
              voucherCode: code,
              sku: item.sku,
              quantity: item.quantity,
              unitPrice: item.priceAtAdd,
              discountAmount,
            });
          }
        }
      }
    }

    // === APPLY BEST ENTIRE ORDER VOUCHER ===
    if (bestCartVoucher) {
      finalTotal -= bestCartVoucher.discountAmount;
      totalDiscountAmount += bestCartVoucher.discountAmount;
      results.push({ ...bestCartVoucher, success: true });
    }

    // === APPLY BEST SKU VOUCHERS ===
    const skuVoucherGroups = new Map(); // voucherCode => [items]

    for (const [sku, info] of bestSkuVoucherMap.entries()) {
      usedSkus.add(sku);
      finalTotal -= info.discountAmount;
      totalDiscountAmount += info.discountAmount;

      if (!skuVoucherGroups.has(info.voucherCode)) {
        skuVoucherGroups.set(info.voucherCode, []);
      }

      skuVoucherGroups.get(info.voucherCode).push({
        sku: info.sku,
        quantity: info.quantity,
        unitPrice: info.unitPrice,
        total: parseFloat((info.unitPrice * info.quantity).toFixed(2)),
        discountAmount: info.discountAmount,
      });
    }

    for (const [code, items] of skuVoucherGroups.entries()) {
      const total = items.reduce((sum, i) => sum + i.discountAmount, 0);
      results.push({
        code,
        success: true,
        scope: scope.SPECIFIC_SKUS,
        discountAmount: parseFloat(total.toFixed(2)),
        items,
      });
    }

    return {
      success: true,
      originalTotal,
      totalDiscount: parseFloat(totalDiscountAmount.toFixed(2)),
      finalTotal: parseFloat(finalTotal.toFixed(2)),
      applied: results.filter((r) => r.success),
      ignored: results.filter((r) => !r.success),
    };
  }
}

module.exports = new DiscountService();
