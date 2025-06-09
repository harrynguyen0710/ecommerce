const { v4: uuidv4 } = require('uuid');

const mongoose = require('mongoose');

const ProductVariants = require('./variants.model');

const ProductSchema = new mongoose.Schema({
    productId: {
        type: String, 
        required: true, 
        unique: true,
        index: true,
        default: uuidv4

    },
    title: {
        type: String,
        required: true, 
        trim: true,
    },
    description: { type: String },
    brand: { type: String },
    category: { type: String },
    tags: [{ type: String }],

    attributes: {
        material: { type: String },
        color: [{ type: String }],
        size: [{ type: String }],
    },

    variants: {
        type: [ProductVariants],
        validate: v => Array.isArray(v) && v.length > 0
    },

    status: {
        type: String,
        enum: ['active', 'disabled', 'draft', 'inactive'],
        default: 'active'
    },
}, {
    timestamps: true, 
});


module.exports = mongoose.model('Products', ProductSchema);
