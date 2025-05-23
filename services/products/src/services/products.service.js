// models
const Product = require("../models/products.model");
const OutboxEvent = require("../models/outbox.model");

// packages
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// utils
const { syncAttributes } = require("../utils/syncAttributes");

class ProductService {
  constructor() {
    this.Product = Product;
    this.OutboxEvent = OutboxEvent;
  }

  async create({ title, variants }) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const productId = uuidv4();

      const result = syncAttributes(variants);

      if (!result) throw new Error("syncAttributes returned undefined");

      const { colorSet, sizeSet } = result;

      const attributes = {
        color: Array.from(colorSet),
        size: Array.from(sizeSet),
      };

      const product = new this.Product({
        productId,
        title,
        variants,
        attributes,
      });

      await product.save({ session });

      const event = new this.OutboxEvent({
        eventType: "product.created",
        payload: {
          productId,
          title,
          variants,
        },
      });

      await event.save({ session });

      await session.commitTransaction();
      session.endSession();

      return product;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  async getAll({ filters, sort, skip, limit }) {
    const selections = ["_id", "productId", "title", "tags"].join(" ");

    const [products, total] = await Promise.all([
      Product.find(filters)
        .select(selections)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filters),
    ]);

    return { products, total };
  }

  async getProductById(id, fields = "") {
    return await Product.findOne({ productId: id }).select(
      `${fields} -createdAt -updatedAt`
    );
  }
  
}

module.exports = new ProductService();
