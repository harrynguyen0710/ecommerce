const express = require('express');
const router = express.Router();

const inventoryController = require('../controllers/inventory.controller');

router.get('/inventory', inventoryController.getInventoryBySkus);
router.patch('/inventory/bulk', inventoryController.bulkUpdateInventoryBySkus);
router.patch('/inventory/:sku', inventoryController.updateInventoryBySku);
router.get('/internal/inventory/skus', inventoryController.getSkus);

router.delete("/delete-all", inventoryController.handleDeleteAllInventory);


module.exports = router;