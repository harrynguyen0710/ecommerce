const express = require('express');
const router = express.Router();

const productController = require('../controllers/products.controller');

// POST v1/api/products
router.post('/', productController.createProduct);

// GET v1/api/products
router.get('/', productController.getProducts);

// GET v1/api/products/:id
router.get('/:id', productController.getProductById);

// PUT v1/api/products/:id
// router.put('/:id', productController.updateProduct);

// DELETE v1/api/products/:id
// router.delete('/:id', productController.deleteProduct);

router.delete("/delete-all", productController.handleDeleteAllProducts);


module.exports = router;