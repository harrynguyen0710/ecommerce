const Joi = require("joi");

const cartItemSchema = Joi.object({
    sku: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
    priceAtAdd: Joi.number().positive().required(),
    productId: Joi.string().required(),
    name: Joi.string().optional(),
    image: Joi.string().uri().optional(),
    color: Joi.string().optional(),
    size: Joi.string().optional(),
});

const cartSchema = Joi.object({
  userId: Joi.string().required(),
  items: Joi.array().items(cartItemSchema).min(1).required()
});

module.exports = { cartSchema };
