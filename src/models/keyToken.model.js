'use strict'
const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

const keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Shop',
    },
    usedRefreshTokens: {
        type: [String],
        default: [],
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        default: null,       
        index: { expires: '0' } // TTL index for auto-expiry if needed 
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

const keyTokenModel = model(DOCUMENT_NAME, keyTokenSchema);

module.exports = keyTokenModel;