const productService = require('../services/products.service');

class ProductController {
  async createProduct(req, res, next) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }

}

module.exports = new ProductController();
