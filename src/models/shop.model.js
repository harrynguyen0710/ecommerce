'use strict'
const { mongoose, model, Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const DOCUMENT_NAME = 'Shop';
const COLLECTION_NAME = 'Shops';

const shopSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxLength: 150
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String, 
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive',
    },
    verify: {
        type: Schema.Types.Boolean,
        default: false,
    },
    roles: {
        type: Array, 
        default: [],
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

// middleware to hash password before saving
shopSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next(); // skip if the password is modified
    }

    try {
        const salt = 10; // define salt round
        const hashedPassword = await bcrypt.hashSync(this.password, salt);
        
        this.password = hashedPassword;

        next();
    } catch (error) {
        next(error); // pass error to the next middleware
    }

});



const shopModel = model(DOCUMENT_NAME, shopSchema);
module.exports = shopModel;

