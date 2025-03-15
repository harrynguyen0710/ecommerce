'use strict'
const express = require('express')
const router = express.Router();
const { checkAuthentication, checkTokenExpiry } = require('../../auth/checkAuth');

const inventoryController = require('../../controllers/inventory.controller');
const asyncHandler = require('../../helpers/asyncHandler');

router.use(checkAuthentication);
router.post('/add', asyncHandler(inventoryController.addStock));


module.exports = router;