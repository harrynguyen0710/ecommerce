'use strict'
const express = require('express')
const router = express.Router();
const { checkAuthentication, checkTokenExpiry } = require('../../auth/checkAuth');

const checkoutController = require('../../controllers/checkout.controller');
const asyncHandler = require('../../helpers/asyncHandler');

router.post('/review', asyncHandler(checkoutController.checkoutReview));


module.exports = router;