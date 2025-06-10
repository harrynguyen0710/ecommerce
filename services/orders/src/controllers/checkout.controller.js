const checkoutOrchestrator = require("../orchestrators/checkoutOrchestrator");

class CheckoutController {
  async checkout(req, res) {
    const token = req.token;
    const userId = req.userId;

    const { appliedVouchers = [] } = req.body;

    try {
      const result = await checkoutOrchestrator({
        token,
        userId,
        appliedVouchers,
      });

      return res.status(200).json({
        success: true,
        message: "Checkout initiated successfully",
        correlationId: result.correlationId,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Checkout failed: " + error.message,
      });
    }
  }
}

module.exports = new CheckoutController();
