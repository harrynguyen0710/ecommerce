const express = require('express');
const validateInput =  require("../middlewares/validateInput");

const router = express.Router();
const discountController = require('../controllers/discount.controller');

router.get("/", discountController.getAllDiscounts);
router.get("/:code", discountController.getDiscountByCode);
router.post('/', validateInput, discountController.createDiscount);

router.patch("/:code", discountController.updateDiscountByCode);
router.patch('/:code/skus', discountController.updateApplicableSkus);
module.exports = router;