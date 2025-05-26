const mongoose = require('mongoose');


const VariantSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    color: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String }
}, { _id: false }) // variants don't need individual _id

module.exports = VariantSchema;
