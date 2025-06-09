const { prisma } = require("../config/prisma");

const {
  reserveInventory,
  confirmBuy,
  revertReserve,
} = require("../repositories/inventory.internal.repository");

class InventoryService {
  async getInventoryBySkus(
    skus,
    fields = ["sku", "quantity", "reserved", "status", "updatedAt"]
  ) {
    try {
      if (!Array.isArray(skus) || skus.length === 0) {
        throw new Error("Invalid or missing SKUs");
      }

      const select = {};
      for (const field of fields) {
        select[field] = true;
      }

      const records = await prisma.inventory.findMany({
        where: {
          sku: {
            in: skus,
          },
        },
        select,
      });

      if (!records || records.length === 0) {
        throw new Error("No inventory found for the provided SKUs");
      }

      return records;
    } catch (error) {
      console.error("Error fetching inventory:", error);
      throw new Error("Failed to fetch inventory");
    }
  }

  async updateInventoryBySku(sku, updates) {
    const { updatedAt, ...fields } = updates;

    if (!updatedAt) {
      throw new Error("updatedAt is required for idempotent update");
    }

    const result = await prisma.inventory.updateMany({
      where: {
        sku,
        updatedAt: new Date(updatedAt),
      },
      data: fields,
    });

    if (result.count === 0) {
      throw new Error(`Update conflict or no inventory found for SKU: ${sku}`);
    }

    const updated = await prisma.inventory.findUnique({ where: { sku } });
    return updated;
  }

  async bulkUpdateInventoryBySkus(updates) {
    const results = [];

    for (const update of updates) {
      const { sku, updatedAt, ...fields } = update;

      if (!sku || !updatedAt || Object.keys(fields).length === 0) {
        results.push({
          sku,
          success: false,
          error: "Missing sku, updatedAt or fields to update",
        });
        continue;
      }

      try {
        const result = await prisma.inventory.updateMany({
          where: {
            sku,
            updatedAt: new Date(updatedAt),
          },
          data: fields,
        });

        if (result.count === 0) {
          results.push({
            sku,
            success: false,
            error: "Update conflict or not found",
          });
        } else {
          const updated = await prisma.inventory.findUnique({ where: { sku } });
          results.push({ sku, success: true, data: updated });
        }
      } catch (error) {
        results.push({ sku, success: false, error: error.message });
      }
    }

    return results;
  }

  async getSkusByProductIds(rawIds) {
    const productIds = rawIds.split(",");

    const skus = await prisma.inventory.findMany({
      where: {
        productId: {
          in: productIds,
        },
      },
      select: {
        sku: true,
        productId: true,
      },
    });

    return skus;
  }

  async insertBulkInventory(payload) {
    const result = await prisma.inventory.createMany({
      data: payload,
      skipDuplicates: true,
    });

    return result;
  }

  async reserveItems(items) {
    try {
      return await prisma.$transaction(async (tx) => {
        for (const item of items) {
          await reserveInventory(tx, item);
        }
        return { success: true };
      });
    } catch (error) {
      return { success: false, reason: error.message };
    }
  }

  async confirmOrder(items) {
    try {
      return await prisma.$transaction(async (tx) => {
        for (const item of items) {
          await confirmBuy(tx, item);
        }
        return { success: true };
      });
    } catch (error) {
      return { success: false, reason: error.message };
    }
  }

  async revertReserve(items) {
    try {
      return await prisma.$transaction(async (tx) => {
        for (const item of items) {
          await revertReserve(tx, items);
        }
        return { success: true };
      })
    } catch (error) {
      return { success: false, reason: error.message }; 
    }
  }

  async deleteAllInventory() {
    const result = await prisma.inventory.deleteMany({});
    return { deletedInventory: result.count };
  }
}

module.exports = new InventoryService();
