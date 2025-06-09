const productService = require("../services/products.service");
const { builderQuery } = require("../utils/queryBuilder");

class ProductController {
  async createProduct(req, res, next) {
    try {
      const product = await productService.create(req.body, req.meta);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }

  async getProducts(req, res) {
    try {
      const allowedFilters = [
        "status",
        "category",
        "brand",
        "tags",
        "attributes.material",
        "attributes.size",
      ];

      const options = builderQuery(req.query, allowedFilters);

      const { products, total } = await productService.getAll(options);

      res.status(200).json({
        data: products,
        pagination: {
          page: options.page,
          limit: options.limit,
          total,
          pages: Math.ceil(total / options.limit),
        },
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch products", details: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const fields = req.query.fields?.split(",").join(" ") || "";

      const product = await productService.getProductById(id, fields);

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      res.status(200).json(product);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch product", details: error.message });
    }
  }

  async  handleDeleteAllProducts(req, res) {
  try {
    const result = await productService.deleteAllProducts();
    res.status(200).json({ message: "✅ All products deleted", ...result });
  } catch (err) {
    console.error("❌ Product deletion error:", err.message);
    res.status(500).json({ error: "Failed to delete products" });
  }
}

}

module.exports = new ProductController();
