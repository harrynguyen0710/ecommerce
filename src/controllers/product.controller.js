'use strict'

const { SuccessResponse, CREATED } = require('../core/success.response');
const ProductService = require('../services/product.service');

class ProductController {
    createProduct = async(req, res, next) => {
        new CREATED({
            message: 'Create a new product successfully!',
            metadata: await ProductService.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.userId,
            })
        }).send(res);
    }    

    updateProduct = async(req, res, next) => {
        new SuccessResponse({
            message: 'Update product successfully!',
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId , {
                ...req.body,
                product_shop: req.userId,
            })
        }).send(res);
    }

    findAllProducts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get all products successfully!',
            metadata: await ProductService.findAllProducts(req.query),
        }).send(res);
    }

    searchProducts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Search product successfully!',
            metadata: await ProductService.searchProductsByKeyword(req.params),
        }).send(res);
    }

    publishProductByShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Published product successfully!',
            metadata: await ProductService.publishProduct(
                req.params.id,
                req.userId,
            )
        }).send(res);
    }

    unpublishProductByShop = async(req, res, next) => {
        new SuccessResponse({
            message: 'Unpublished product successfully',
            metadata: await ProductService.unpublishProduct(
                req.param.id,
                req.body.product_shop,
            )
        }).send(res);
    }

    getProductDetails = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get product details successfully!',
            metadata: await ProductService.findProductById({
                productId: req.params.product_id,
            }),
        }).send(res);   
    }

    getDraftProducts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get draft products successfully!',
            metadata: await ProductService.getDraftProducts({
                product_shop: req.body.product_shop,
            }),
        }).send(res);
    }

    getPublishedProducts = async(req, res, next) => {
        new SuccessResponse({
            message: 'Get published products successfully!',
            metadata: await ProductService.getPublishedProducts({
                product_shop: req.body.product_shop,
            }),
        }).send(res);
    }


}

module.exports = new ProductController();