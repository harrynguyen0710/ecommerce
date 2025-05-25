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
}

module.exports = new DiscountController();
