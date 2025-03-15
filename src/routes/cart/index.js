'use strict'
const express = require('express')
const router = express.Router();
const { checkAuthentication, checkTokenExpiry } = require('../../auth/checkAuth');

const cartController = require('../../controllers/cart.controller');
const asyncHandler = require('../../helpers/asyncHandler');

router.post('/add', asyncHandler(cartController.addToCart));
router.delete('/delete', asyncHandler(cartController.delete));
router.post('/update', asyncHandler(cartController.update));
router.get('', asyncHandler(cartController.listToCart));

module.exports = router;