'use strict'

const CheckoutService = require('../services/checkout.service');
const { SuccessResponse, CREATED, NO_CONTENT } = require('../core/success.response');

class CheckoutController {
    checkoutReview = async(req, res, next) => {
        new SuccessResponse({
            message: 'Checkout review successfully',
            metadata: await CheckoutService.checkoutReview( req.body )
        }).send(res);
    }
}

module.exports = new CheckoutController();