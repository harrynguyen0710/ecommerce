'use strict'

const express = require('express');
const router = express.Router();
const { checkAuthentication, checkTokenExpiry } = require('../../auth/checkAuth');
const asyncHandler = require("../../helpers/asyncHandler")
const productController = require("../../controllers/product.controller");


// get all products
router.get('/', asyncHandler(productController.findAllProducts));

// get product detail by id
router.get('/:product_id', asyncHandler(productController.getProductDetails));

// search products by keyword
router.get('/search/:keySearch', asyncHandler(productController.searchProducts));


// check token expiration
// router.use(asyncHandler(checkTokenExpiry));

// authenticate the user before using those features below
router.use(asyncHandler(checkAuthentication));

// publish product (only update 2 properties)
router.patch('/published/:id', asyncHandler(productController.publishProductByShop));

// set draft product (only update 2 properties)
router.patch('/unpublised/:id', asyncHandler(productController.unpublishProductByShop));

// get all draft products
router.get('/drafts/all', asyncHandler(productController.getDraftProducts));



// get all publised products
router.get('/publised/all', asyncHandler(productController.getPublishedProducts));


// get all unpublished products

// create a product
router.post('/create-product', asyncHandler(productController.createProduct));
router.patch('/edit-product/:productId', asyncHandler(productController.updateProduct));

module.exports = router;