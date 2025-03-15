'use strict'

const  cart  = require('../models/cart.model');
const { convertToObjectIdMongodb } = require('../utils/index');

const findCartById = async (cartId) => {
    return await cart.findOne({
        _id:  convertToObjectIdMongodb(cartId),
        cart_state: 'active'
    }).lean();
}

module.exports = { 
    findCartById,
}