'use strict'

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders';

const orderSchema = new Schema({
  order_userId: { type: Number, required: true },
  order_checkout: { type: Object, required: true },
  order_shipping: { type: Object, default: {} },
  order_payment: { type: Object, default: {} },
  order_products: { type: Array, required: true },
  order_tracking: { type: String, default: '#0000118052022'}, 
  order_status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled', 'delivering'], default: 'pending' },
}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createedOn',
        updatedAt: 'modifiedOn',
    }
});

const order = model(DOCUMENT_NAME, orderSchema);

module.exports = order;