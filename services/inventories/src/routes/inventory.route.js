const express = require('express');
const router = express.Router();

const inventoryController = require('../controllers/inventory.controller');

router.get('/inventory', inventoryController.getInventoryBySkus);
router.patch('/inventory/:sku', inventoryController.updateInventoryBySku);
router.patch('/inventory/bulk', inventoryController.bulkUpdateInventoryBySkus);
router.get('/internal/inventory/skus', inventoryController.getSkus);

module.exports = router;