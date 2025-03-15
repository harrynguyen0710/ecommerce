'use strict'

const { NotFoundError, BadRequestError } = require('../core/error.response');
const { product } = require('../models/products.model');
const { convertToObjectIdMongodb } = require('../utils/index')
const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;

    const products = await product.find(filter)
                .sort(sort === 'ctime' ? { _id: -1 } : { _id: 1 })
                .skip(skip)
                .limit(limit)
                .select(select.join(' '))
                .lean();

    return products;
}

const getProductById = async ({ productId }) => {

    // set the selected properties for a product
    const select = [
        'product_name', 
        'product_thumb', 
        'product_description', 
        'product_price', 
        'product_quantity', 
        'product_type',
    ];

    // only get the shop name of this product
    const populate = {
        path: 'product_shop',
        select: 'name',
    }

    // filter criteria for querying
    const filter = { _id: productId  , isPublished: false, isDraft: true}

    const foundProduct = await product.findOne(filter)
        .populate(populate)
        .select(select.join(' '))
        .lean();
    
    if (!foundProduct) throw new NotFoundError('Not Found Product');

    return foundProduct;
}

const queryProduct = async (productId) => {
    return await product.findOne({ _id: convertToObjectIdMongodb(productId) }).lean();
}

const searchProduct = async({ keySearch }) => {
    const foundProducts = await product.find(
        {
            isDraft: true,
            $text: { $search: keySearch }, // full-text search
        },
        {
            score: { $meta: 'textScore' },
        }
    )
    .sort({ score: { $meta: 'textScore' } })
    .lean();

    return foundProducts;
}

const publishProduct = async({ id, product_shop }) => {
    const updatedProduct = await product.findOneAndUpdate(
        { _id: id, product_shop: product_shop },
        { isDraft: false, isPublished: true, },
        { new: true }
    );

    if (!updatedProduct) {
        throw new NotFoundError('Not Found Product');
    }

    return updatedProduct;
}

const unpublishProduct = async({ id, product_shop }) => {
    const updatedProduct = await product.findOneAndUpdate(
        { _id: id, product_shop: product_shop },
        { isDraft: true, isPublished: false },
        { new: true }
    );

    if (!updatedProduct) {
        throw new NotFoundError('Not Found Product');
    }

    return updatedProduct;
}

const getDraftProducts = async({ product_shop }) => {
    const filter = { product_shop: product_shop, isDraft: true, isPublished: false }
    
    const foundProducts = await product.find(filter).sort({ createdAt: -1 }).lean();

    if (!foundProducts) {
        throw new NotFoundError('Not Found Products');
    }

    return foundProducts;
}

const getPublishedProducts = async({ product_shop }) => {
    const filter = { product_shop: product_shop, isDraft: false, isPublished: true }

    const foundProducts = await product.find(filter).sort({ createdAt: -1 }).lean();

    if (!foundProducts) {
        throw new NotFoundError('Not Found Products');
    }

    return foundProducts;
}

const updateProductById = async({ 
    productId,
    nestedObject,
    model,
    isNew = true 
}) => {
    productId = String(productId);
    const newProduct = await model.findByIdAndUpdate(productId, nestedObject, {
        new: isNew,
    });
    return newProduct;
}


const checkProductByServer = async (products) => {
    return await Promise.all( products.map( async product => {
        const foundProduct = await queryProduct(product.productId);
        if (!foundProduct) {
            throw new BadRequestError(`Product ${product.productId} not found`);
        }
        return {
            price: foundProduct.product_price,
            quantity: foundProduct.product_quantity,
            productId: foundProduct._id,
        };
    }))
}

 
module.exports = {
    findAllProducts,
    getProductById,
    searchProduct,
    publishProduct,
    unpublishProduct,
    getPublishedProducts,
    getDraftProducts,
    updateProductById,
    queryProduct,
    checkProductByServer,
}


// Model.find(
//     { age: { $gte: 18 }, isActive: true },  // Filter
//     { name: 1, age: 1 },                    // Projection
//     { sort: { age: -1 }, limit: 5 }         // Options
// )