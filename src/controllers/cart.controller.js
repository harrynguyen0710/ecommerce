'use strict'

const CartService = require('../services/cart.service');
const { SuccessResponse, CREATED, NO_CONTENT } = require('../core/success.response');

class CartController {

    addToCart = async(req, res, next) => {
        new SuccessResponse({
            message: 'Create a new cart successfully',
            metadata: await CartService.createUserCart( req.body )
        }).send(res);
    }

    update = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update a cart successfully',
            metadata: await CartService.addToCartV2( req.body )
        }).send(res);
    }

    delete = async (req, res, next) => {
        new NO_CONTENT({
            message: 'Delete a cart successfully',
            metadata: await CartService.deleteUserCart( req.body )
        }).send(res);
    }

    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get cart successfully',
            metadata: await CartService.getListUserCart( req.query )
        }).send(res);
    }
}

module.exports = new CartController();
