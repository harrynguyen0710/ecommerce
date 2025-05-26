const inventoryService = require("../services/inventory.service");

class InventoryController {
  async getInventoryBySkus(req, res) {
    try {
      const skus = req.query.skus?.split(",").map((s) => s.trim());

      if (!Array.isArray(skus) || skus.length === 0) {
        return res.status(400).json({ error: "Invalid or missing SKUs" });
      }

      const result = await inventoryService.getInventoryBySkus(skus);
      console.log("Result:", result);
      if (!result || result.length === 0) {
        return res
          .status(404)
          .json({ error: "No inventory found for the provided SKUs" });
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      res
        .status(500)
        .json({ error: "Failed to fetch inventory", details: error.message });
    }
  }

  async updateInventoryBySku(req, res) {
    try {
      const updates = req.body;
      const sku = req.params.sku;

      if (!Array.isArray(updates) || updates.length === 0) {
        return res
          .status(400)
          .json({ error: "Request body must be a non-empty array of updates" });
      }

      const result = await inventoryService.updateInventoryBySku(sku, updates);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error updating inventory:", error);
      res
        .status(500)
        .json({ error: "Failed to update inventory", details: error.message });
    }
  }

  async bulkUpdateInventoryBySkus(req, res) {
    try {
      const updates = req.body;

      if (!Array.isArray(updates) || updates.length === 0) {
        return res
          .status(400)
          .json({ error: "Invalid or missing update data" });
      }

      const results = await inventoryService.bulkUpdateInventoryBySkus(updates);

      res.status(200).json({
        message: "Bulk inventory update complete",
        updated: results.length,
        results,
      });
    } catch (error) {
      console.error("Bulk update error:", error);
      res.status(500).json({
        error: "Failed to perform bulk inventory update",
        details: error.message,
      });
    }
  }

  async getSkus (req, res) {
    try {
      const rawIds = req.query.productIds;
      console.log('Raw IDs:', rawIds);
      if (!rawIds) {
        return res.status(400).json({ error: "Missing SKUs query parameter" });
      }

      const skus = await inventoryService.getSkusByProductIds(rawIds);

      return res.json({ skus }); 

    } catch (error) {
      console.error("Error fetching SKUs:", error);
      res.status(500).json({ error: "Failed to fetch SKUs", details: error.message });
    }
  }

}

module.exports = new InventoryController();
