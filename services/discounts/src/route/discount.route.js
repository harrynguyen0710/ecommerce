const express = require('express');

const { previewDiscountSchema } = require("../validators/previewDiscountSchema");
const { discountSchema } = require("../validators/discountSchema");

const validateRequest =  require("../middlewares/validateRequest");

const router = express.Router();
const discountController = require('../controllers/discount.controller');

router.get("/", discountController.getAllDiscounts);
router.get("/:code", discountController.getDiscountByCode);
router.post('/', validateRequest(discountSchema), discountController.createDiscount);

router.patch("/:code", discountController.updateDiscountByCode);
router.patch('/:code/skus', discountController.updateApplicableSkus);

router.post("/preview", validateRequest(previewDiscountSchema), discountController.previewDiscount);

module.exports = router;