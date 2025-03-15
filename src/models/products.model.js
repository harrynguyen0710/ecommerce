'use strict'
const { model, Schema } = require('mongoose');
const { default: slugify } = require('slugify');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true }, 
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'}, 
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_rating: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'], 
        max: [5, 'Rating can not be larger than 5'],
        set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

// full-text search: enables MongoDB to perform efficient full-text search queries on product_name, product_description
productSchema.index({
     product_name: 'text', 
     product_description: 'text', 
});

// middleware: run before save() and create()
productSchema.pre('save', function(next) {
    this.product_slug = slugify(this.product_name, { lower: true }); // make product_name to be abc-def (slugify) for SEO
    next();
});

const clothingSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    collection: 'clothes',
    timestamps: true,
});

const electronicSchema = new Schema({
    manufacture: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
}, {
    collection: 'electronics',
    timestamps: true,
})

const furnitureSchema = new Schema({
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId ,ref: 'Shop' },
}, {
    collection: 'furniture',
    timestamps: true,
});

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronics: model('Electronics', electronicSchema),
    clothing: model('Clothing', clothingSchema),
    furniture: model('Furniture', furnitureSchema),
};

