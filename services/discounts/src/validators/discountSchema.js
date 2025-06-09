const Joi = require("joi");

const discountSchema = Joi.object({
  code: Joi.string().required(),
  type: Joi.string().valid("PERCENTAGE", "FIXED").required(),
  value: Joi.number().positive().required().when("type", {
    is: "PERCENTAGE",
    then: Joi.number().max(100).message("Percentage discount cannot exceed 100%"),
  }),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
  minOrderValue: Joi.number().min(0).optional(),
  maxUsage: Joi.number().integer().min(0).optional(),
  usageCount: Joi.number().integer().min(0).optional(),
  perUserLimit: Joi.number().integer().min(0).optional(),
  applicableSkus: Joi.array().items(Joi.string()).optional(),
  applicableProductIds: Joi.array().items(Joi.string()).optional(),
});

module.exports = {
    discountSchema,
}