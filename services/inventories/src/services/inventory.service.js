const { prisma } = require("../config/prisma");

class InventoryService {
  async getInventoryBySkus(skus, fields = ['sku', 'quantity', 'reserved', 'status']) {
    try {
      console.log("Fetching inventory for SKUs:", skus);
      if (!Array.isArray(skus) || skus.length === 0) {
        throw new Error("Invalid or missing SKUs");
      }
      console.log("SKUs:", skus);
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

      const results = {};

      for (const r of records) {
        results[r.sku] = { ...r }; 
      }

      return results;

    } catch (error) {
      console.error("Error fetching inventory:", error);
      throw new Error("Failed to fetch inventory");
    }
  }
}

module.exports = new InventoryService();
