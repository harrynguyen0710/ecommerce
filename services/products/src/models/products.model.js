const mongoose = require('mongoose');

const ProductVariants = require('./variants.model');

const ProductSchema = new mongoose.Schema({
    productId: {
        type: String, 
        required: true, 
        unique: true, 
        index: true,
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
        enum: ['active', 'disabled', 'draft'],
        default: 'active'
    },
}, {
    timestamps: true, 
    _id: false,
});


module.exports = mongoose.model('Products', ProductSchema);
