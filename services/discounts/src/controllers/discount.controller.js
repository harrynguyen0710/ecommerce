const discountService = require("../services/discount.service");

class DiscountController {
  async createDiscount(req, res) {
    try {
      const payload = req.body;

      const discount = await discountService.createDiscount(payload);

      return res.status(201).json(discount);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Failed to create discount: " + error.message });
    }
  }

  async getAllDiscounts(req, res) {
    try {
      const discounts = await discountService.getAllDiscounts();
      res.json(discounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDiscountByCode(req, res) {
    try {
      const { code } = req.params;
      const discount = await discountService.getDiscountByCode(code);

      if (!discount) {
        return res.status(404).json({ error: "Discount not found" });
      }

      res.json(discount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } 

  async updateDiscountByCode(req, res) {
    try {
      const { code } = req.params;
      const payload = req.body;

      const updatedDiscount = await discountService.updateDiscountByCode(code, payload);

      if (!updatedDiscount) {
        return res.status(404).json({ error: "Discount not found" });
      }

      res.json(updatedDiscount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateApplicableSkus(req, res) {
    try {
      const { code } = req.params;
       const { add = [], remove = [] } = req.body;

      const updatedDiscount = await discountService.updateApplicableSkus(code, { add, remove });

      if (!updatedDiscount) {
        return res.status(404).json({ error: "Discount not found" });
      }

      res.json(updatedDiscount);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async previewDiscount(req, res) {
    try {
      const userId = req.userId;
      
      const result = await discountService.validateAndApplyDiscount({userId, ...req.body});

      return res.status(200).json(result);

    } catch (error) {
      res.status(500).json({ error: error.message });

    }
  }

}

module.exports = new DiscountController();
