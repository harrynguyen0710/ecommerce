"use strict";
const { model, Schema, SchemaType } = require("mongoose");

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";

const keyTokenSchema = new Schema(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    inven_location: {
        type: String, 
        default: 'unknown',
    },
    inven_stock: {
        type: Number,
        required: true,
    },
    inven_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop',
    },
    inven_reservations: {
        type: Array, 
        default: []
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

const inventoryModel = model(DOCUMENT_NAME, keyTokenSchema);

module.exports = inventoryModel;
