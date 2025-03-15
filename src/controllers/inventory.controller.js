'use strict'

const InventoryService = require('../services/inventory.service');
const { SuccessResponse, CREATED, NO_CONTENT } = require('../core/success.response');

class InventoryController {

    addStock = async(req, res, next) => {
        new CREATED({
            message: 'Create a new stock successfully',
            metadata: await InventoryService.addStockToInventory( req.body )
        }).send(res);
    }

}

module.exports = new InventoryController();
