'use strict'

const {
    findCartById
} = require('../repositories/cart.repository.js');
const { order } = require('../models/order.model.js');  
const { BadRequestError, ForbiddenError, NotFoundError } = require('../core/error.response');
const { checkProductByServer } = require('../repositories/product.repository.js');
const { getDiscountAmount } = require('../services/discount.service.js');
const { accquireLock, releaseLock } = require('./redis.service.js');

class CheckoutService {

    static async checkoutReview({ 
        cartId, userId, shop_order_ids = []
    }) {
        const foundCart = await findCartById(cartId);
        if (!foundCart) throw new NotFoundError('Cart not found');

        if (foundCart.cart_userId.toString() !== userId) {
            throw new ForbiddenError('You are not allowed to access this cart');
        }

        if (!shop_order_ids.length) {
            throw new BadRequestError('You must have at least one shop order id');
        }

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        }, shop_order_ids_new = [];

        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i];

            if (!item_products.length) {
                throw new BadRequestError('You must have at least one product in the shop order');
            }

            const checkProductServer = await checkProductByServer(item_products);

            if (!checkProductServer[0]) throw new BadRequestError('Product not found'); 

            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + product.price * product.quantity;
            }, 0);

            checkout_order.totalPrice += checkoutPrice;

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceAfterDiscount: checkoutPrice,
                item_products: checkProductServer,
            }

            if (shop_discounts.length > 0) {
                // assume that there is only one discount for each shop
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    code: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer,
                });
                // total price after discount
                checkout_order.totalDiscount += discount;

                if (discount > 0) {
                    itemCheckout.priceAfterDiscount = checkoutPrice - discount;
                }


            }
            
            // total price after discount
            checkout_order.totalCheckout += itemCheckout.priceAfterDiscount;
            
            shop_order_ids_new.push(itemCheckout);  
            
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {
        const { shop_order_ids_new, checkout_order } = await this.checkoutReview({
            cartId,
            userId, 
            shop_order_ids
        });

        const products = shop_order_ids_new.flatMap( order => order.item_products );
        console.log(`[1]::`, products);
        
        const acquireProducts = [];
        
        for (let i = 0; i < products.length; i++) {
            const { product_id, quantity } = products[i];
            console.log(`[2]::`, product_id, quantity);
            const keyLock = await accquireLock(product_id, quantity, cartId);
            acquireProducts.push(keyLock ? true : false);

            if (keyLock) {
                await releaseLock(keyLock);
            }
        }   

        // if any changes
        if (acquireProducts.includes(false)) {
            throw new BadRequestError('Some products are not available');   
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,
        });

        if (newOrder) {

        }

        return newOrder;
    }

    static async getOrdersByUser(orderId) {}

    static async getOneOrderByUser(orderId) {}

    static async cancelOrderByUser(orderId) {}

    static async updateOrderByUser(orderId) {}


    
}


module.exports = CheckoutService