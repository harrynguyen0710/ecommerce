'use strict'

const { BadRequestError, NotFoundError } = require('../core/error.response');
const discount = require('../models/discount.model');
const { findAllDiscountCodeUnSelect, checkDiscountExist } = require('../repositories/discount.repository');
const { convertToObjectIdMongodb } = require('../utils');
const { findAllProducts } = require('../repositories/product.repository');

class DiscountService {

    static async createDiscountCode(payload) {
        const {
            discount_name, discount_description, discount_type = 'fixed_amount', discount_value,
            discount_max_value, discount_code, discount_start_date, discount_end_date,
            discount_max_uses, discount_uses_count = 0, discount_max_uses_per_user, discount_min_order_value = 0,
            discount_shopId, discount_is_active = true, discount_applies_to, discount_product_ids = []
        } = payload;
        
        if (!discount_name || !discount_description || !discount_value || !discount_max_value || !discount_code ||
            !discount_max_uses || !discount_max_uses_per_user || !discount_applies_to) {
            throw new BadRequestError('Required fields are missing');
        }
    
        if (!discount_start_date || !discount_end_date) {
            throw new BadRequestError('Start date and end date are required');
        }
    
        const startDate = new Date(discount_start_date);
        const endDate = new Date(discount_end_date);
    
        if (startDate.toString() === 'Invalid Date' || endDate.toString() === 'Invalid Date') {
            throw new BadRequestError('Invalid date format');
        }
    
        if (startDate >= endDate) {
            throw new BadRequestError('Start date must be before end date');
        }
    
        // Check for existing discount
        const foundDiscount = await discount.findOne({
            discount_code,
            discount_shopId: convertToObjectIdMongodb(discount_shopId),
        }).lean();
    
        if (foundDiscount) {
            throw new BadRequestError('Discount exists!');
        }
    
        // Create new discount
        const newDiscount = await discount.create({
            discount_name,
            discount_description,
            discount_type,
            discount_value,
            discount_code,
            discount_max_value,
            discount_start_date: startDate,
            discount_end_date: endDate,
            discount_max_uses,
            discount_uses_count,
            discount_users_used: [],
            discount_max_uses_per_user,
            discount_min_order_value,
            discount_shopId: convertToObjectIdMongodb(discount_shopId),
            discount_is_active,
            discount_applies_to,
            discount_product_ids: discount_applies_to === 'all' ? [] : discount_product_ids,
        });
    
        return newDiscount;
    }
    
    

    static async updateDiscountCode () {

    }

    static async getAllDiscountCodesWithProduct({
        code, shopId, userId, limit, page
    }) {

        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: shopId,
        }).lean();

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not exists');
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount;

        let products;

        if (discount_applies_to === 'all') {
            // get all products
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongodb(shopId),
                    isPublished: false,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            });

        }

        if (discount_applies_to === 'specific') {
            console.log('hi spec');
            // get the products id
            products = await findAllProducts({
                filter: {
                    _id: {$in: discount_product_ids},
                    isPublished: false,
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        console.log('final product::', products);
        return products;

    }

    static async getAllDiscountCodesByShop({
        limit, page, shopId
    }) {
        const discounts = await findAllDiscountCodeUnSelect({
            limit: +limit,
            page: +page, 
            filter: {
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true,
            },
            unSelect: ['__v', 'discount_shopId'],
            model: discount
        });

        return discounts;
    }

    static async getDiscountAmount({ code, userId, shopId, products }) {

        const foundDiscount = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: code, 
                discount_shopId: convertToObjectIdMongodb(shopId),
            }
        });

        if (!foundDiscount) {
            throw new NotFoundError(`discount doesn't exist`);
        }

        const { 
            discount_is_active, 
            discount_max_uses, 
            discount_min_order_value,
            discount_users_used,
            discount_type,
            discount_value,
            discount_start_date,
            discount_end_date,
            discount_max_uses_per_user
        } = foundDiscount;

        if (!discount_is_active) throw new NotFoundError(`discount expired`);
        if (!discount_max_uses) throw new NotFoundError(`discount are out!`);

        // if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
        //     throw new NotFoundError(`discount code has expired!`);
        // }

        let totalOrder = 0;
        if (discount_min_order_value > 0) {
            // get total
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price);
            }, 0);

            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(`discount requires a minimum order value of ${discount_min_order_value}!`);
            }
        }

        if (discount_max_uses_per_user > 0) {
            const userUserDiscount = discount_users_used.find(user => user.userId === userId);
            if (userUserDiscount) {

            }
        }

        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100);

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount,
        };
    }

    static async deleteDiscountCode({ shopId, codeId, }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        });

        return deleted;
    }
    
    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId),
            }
        });

        if (!foundDiscount) throw new NotFoundError(`discount doesn't exist`);

        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },

            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        });

        return result;
    }
}

module.exports = DiscountService;