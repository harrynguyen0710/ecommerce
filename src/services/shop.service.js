'use strict'

const shopModel = require('../models/shop.model');

const findByEmail = async ({ email, select = {
    email: 1, password: 1, name: 1, status: 1, roles: 1
}}) => { 
    const shop = await shopModel.findOne({ email }).select(select).lean(); // only return selected fields.
    return shop;
}

const checkEmailExist = async ({ email }) => {
    const existedEmail = await shopModel.findOne({ email }).lean();
    return true ? existedEmail : false;
}

const createShop = async ({ email, password, name, roles }) => {
    const newShop = await shopModel.create({ email, password, name, roles });
    return newShop;
}


module.exports = {
    findByEmail,
    checkEmailExist,
    createShop,
}
