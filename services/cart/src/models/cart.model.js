const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  sku: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
  },

  priceAtAdd: {
    type: Number,
    required: true,
  },

  productId: {
    type: String,
    required: true,
  },

  name: {
    type: String,
  },

  image: {
    type: String,
  },

  color: {
    type: String,
  },

  size: {
    type: String,
  },
}, {
    _id: false,
});

const CartSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    items: {
        type: [CartItemSchema], 
        default: [],
    },
}, {
    timestamps: true,
});


module.exports = mongoose.model('Cart', CartSchema);
