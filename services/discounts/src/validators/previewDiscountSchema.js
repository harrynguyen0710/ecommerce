const Joi = require("joi");

const cartItemsSchema = Joi.object({
    sku: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    priceAtAdd:Joi.number().positive().required(),
});

const appliedVoucherSchema = Joi.object({
    code: Joi.string().required(),
});

const previewDiscountSchema = Joi.object({
    userId: Joi.string().required(),
    totalAmount: Joi.number().positive().required(),
    cartItems: Joi.array().items(cartItemsSchema).required(),
    appliedVouchers: Joi.array().items(appliedVoucherSchema).required(),
});

module.exports = {
    previewDiscountSchema,
};
