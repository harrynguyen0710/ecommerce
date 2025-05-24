const express = require('express');
const router = express.Router();

const inventoryController = require('../controllers/inventory.controller');

router.get('/inventory', inventoryController.getInventoryBySkus);

module.exports = router;