// models
const Product = require('../models/products.model');
const OutboxEvent = require('../models/outbox.model');

// packages
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// utils
const { syncAttributes } = require('../utils/syncAttributes');

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

      const { colorSet, sizeSet } = syncAttributes(variants);

      const attributes = {
        color: Array.from(colorSet),
        size: Array.from(sizeSet)
      };

      const product = new this.Product({
        productId,
        title,
        variants,
        attributes
      });

      await product.save({ session });

      const event = new this.OutboxEvent({
        eventType: 'product.created',
        payload: {
          productId,
          title,
          variants
        }
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
}

module.exports = new ProductService();
