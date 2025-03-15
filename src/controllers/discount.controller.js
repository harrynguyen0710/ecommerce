'use strict'

const DiscountService = require('../services/discount.service');
const { SuccessResponse, CREATED } = require('../core/success.response');

class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new CREATED({
            message: 'Successful code generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.userId,
            })
        }).send(res);
    }

    getAllDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code found',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.query,
                shopId: req.userId,
            })
        }).send(res);
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful code found',
            metadata: await DiscountService.getDiscountAmount({
                ...req.query,
            })
        }).send(res);
    }

    getAllDiscountCodesWithProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Successful Code found',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res);
    }

}

module.exports = new DiscountController();