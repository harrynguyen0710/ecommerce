// models
const Product = require("../models/products.model");
const OutboxEvent = require("../models/outbox.model");

// packages
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// utils
const { syncAttributes } = require("../utils/syncAttributes");
const chunkArray = require("../utils/chunkArray");

// clients
const { getInventoryBySkus } = require("../../clients/inventory.client");

const logMetrics = require("../utils/logMetrics");

class ProductService {
  constructor() {
    this.Product = Product;
    this.OutboxEvent = OutboxEvent;
  }

  async create({ title, variants }, meta) {
    const session = await mongoose.startSession();
    session.startTransaction();

    const { correlationId, startTimestamp } = meta;

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
        metadata: {
          correlationId,
          startTimestamp,
        },
      });

      await event.save({ session });

      await session.commitTransaction();
      session.endSession();

      await logMetrics({
        service: "product.service",
        event: "product.service",
        startTimestamp,
        recordCount: 0,
        correlationId,
      });

      console.log(`[${correlationId}] ✅ Product saved & outbox event created`);

      // logg

      return product;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      console.error(
        `[${correlationId}] ❌ Product create failed:`,
        error.message
      );

      throw error;
    }
  }

  async insertManyProducts(products, chunkSize = 10000) {
    const chunks = chunkArray(products, chunkSize);
    let totalInserted = 0;

    for (const [chunkIndex, chunk] of chunks.entries()) {
      try {
        console.time("totalTime::");

        const inserted = await Product.collection.insertMany(chunk, {
          ordered: false,
          rawResult: false,
        });

        console.timeEnd("totalTime::");

        totalInserted += inserted.length;

        console.log(
          `✅ Chunk ${chunkIndex + 1}/${chunks.length}: Inserted ${
            inserted.length
          } products`
        );
      } catch (error) {
        console.error(`❌ Chunk ${chunkIndex + 1} failed:`, error.message);
      }
    }

    return totalInserted;
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
    const product = await Product.findOne({ productId: id })
      .select(`${fields} -createdAt -updatedAt`)
      .lean();

    if (!product) return null;

    const skus = product.variants.map((v) => v.sku);

    const inventoryMap = await getInventoryBySkus(skus);

    const enrichedVariants = product.variants.map((variant) => ({
      ...variant,
      inventory: inventoryMap[variant.sku] || {
        quantity: 0,
        reserved: 0,
        status: "OUT_OF_STOCK",
      },
    }));

    return {
      ...product,
      variants: enrichedVariants,
    };
  }

  async deleteAllProducts() {
    const result = await Product.deleteMany({});
    return { deletedProducts: result.deletedCount };
  }
}

module.exports = new ProductService();
