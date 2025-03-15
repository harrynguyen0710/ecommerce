'use strict'
const express = require('express')
const router = express.Router();
const { checkAuthentication, checkTokenExpiry } = require('../../auth/checkAuth');

const discountController = require('../../controllers/discount.controller');
const asyncHandler = require('../../helpers/asyncHandler');

router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.get('/list-product-code', asyncHandler(discountController.getAllDiscountCodesWithProducts));

router.use(asyncHandler(checkAuthentication));

router.post('/create', asyncHandler(discountController.createDiscountCode));
router.get('', asyncHandler(discountController.getAllDiscountCodes));

module.exports = router;