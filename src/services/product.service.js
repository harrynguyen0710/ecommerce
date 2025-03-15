'use strict'

const { product, clothing, electronics, furniture } = require('../models/products.model');
const { BadRequestError, NotFoundError } = require('../core/error.response');
const { findAllProducts, getProductById, searchProduct, 
    publishProduct, unpublishProduct, getDraftProducts, getPublishedProducts,
    updateProductById} = require('../repositories/product.repository');

const cleanObject = require('../helpers/cleanObject');
const updateNestedObject = require('../helpers/updateNestedObject');
const { insertInventory } = require('../repositories/inventory.repository');

class ProductFactory {
    // Register for product types
    static productRegister = {};

    // Register a product type with a class reference
    static registerProductType(type, classRef) {
        ProductFactory.productRegister[type] = classRef;
    }

    // Create product based on type
    static async createProduct(type, payload) {
        const ProductClass = ProductFactory.productRegister[type];
        
        if (!ProductClass) {
            throw new BadRequestError(`Invalid Product Type: ${type}`);
        }
        const newProduct =  await new ProductClass(payload).createProduct();
        return newProduct;
    }

    // find all products excluding those products that are not published
    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_price', 'product_thumb', 'product_shop'] });
    }

    // find product details by id 
    static async findProductById({ productId }) {
        return await getProductById({ productId });
    }

    // search products by keywords
    static async searchProductsByKeyword({ keySearch }) {
        return await searchProduct({ keySearch });
    }

    // publish product 
    static async publishProduct( id, product_shop ) {
        return await publishProduct({ id, product_shop });
    }

    // unpublish product
    static async unpublishProduct( id, product_shop ) {
        return await unpublishProduct({ id, product_shop: product_shop });
    }

    // get all draft products
    static async getDraftProducts({ product_shop }) {
        return await getDraftProducts({ product_shop });
    }

    // get all published products
    static async getPublishedProducts({ product_shop }) {
        return await getPublishedProducts({ product_shop });
    }

    // update product information
    static async updateProduct( type, productId, payload ) {
        const ProductClass = ProductFactory.productRegister[type];

        if (!ProductClass) {
            throw new BadRequestError(`Invalid Product Types ${type}`);
        }
        
        return new ProductClass(payload).updateProduct(productId);
    }

}


class Product {
    constructor({ product_name, product_thumb, product_description, product_price, product_type, product_shop, product_attributes, product_quantity }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
        this.product_quantity = product_quantity;
    }

    // create a new Product
    async createProduct(product_id) {
        const newProduct = await product.create({ ...this, _id: product_id });
        
        if (newProduct) {
            console.log('Yayyy');
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity,
            });
        }
        return newProduct;
    }

    // update product
    async updateProduct({ productId, nestedObject }) {
        return updateProductById({ productId, nestedObject, model: product });
    }
}

class Clothing extends Product {
    async createProduct() {

        // create a new clothing
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newClothing) {
            throw new BadRequestError('Error occurred when creating clothing');
        }

        // create the corresponding product
        const newProduct = await super.createProduct(newClothing._id);

        if (!newProduct) {
            throw new BadRequestError('Error occurred when creating product');
        }

        return newProduct;
    }

    async updateProduct(productId) {

        // check null and undefined
        // 1 remove attributes are null or undefined
        const objectParams =  cleanObject(this);

        console.log("after cleaning::", objectParams);
        // 2 update child object
        if (objectParams.product_attributes) {
            //update child
            console.log("params in condition::", objectParams);
            await updateProductById({ 
                productId, 
                nestedObject: updateNestedObject(objectParams.product_attributes), 
                model: clothing });
        }
        // 3 update the parent object
        const updatedProduct = await super.updateProduct({ 
            productId, 
            nestedObject:  updateNestedObject(objectParams)
        });
        
        return updatedProduct;
    }

}

class Electronics extends Product {
    async createProduct() {

        // create a new electronics
        const newElectronics = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newElectronics) {
            throw new BadRequestError('Error occurred when creating electronics');
        }

        // create the corresponding product
        const newProduct = await super.createProduct(newElectronics._id);

        if (!newProduct) {
            throw new BadRequestError('Error occurred when creating product');
        }
        console.log('what the hell::', newProduct);
        return newProduct;
    }

    async updateProduct(productId) {
        // check null and undefined
        
        // 1 remove attributes are null or undefined
        const payload = cleanObject(this);

        // console.log('productId::', productId);
        // console.log('payload::', payload);
        console.log('in service::', typeof productId);

        // 2 update child object
        if (payload.product_attributes) {
            //update child
            await updateProductById({ productId, payload, model: electronics });
        }

        // 3 update the parent object
        const updatedProduct = await super.updateProduct({ productId, payload });
        
        return updatedProduct;

    }
}


class Furniture extends Product {
    async createProduct() {

        // create a new furniture
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop,
        });

        if (!newFurniture) {
            throw new BadRequestError('Error occurred when creating furniture');
        }

        // create the corresponding product
        const newProduct = await super.createProduct(newFurniture._id);

        if (!newProduct) {
            throw new BadRequestError('Error occurred when creating product');
        }

        return newProduct;
    }

    async updateProduct(productId) {
        // check null and undefined
        
        // 1 remove attributes are null or undefined
        const objectParams = this;

        // 2 update child object
        if (objectParams.product_attributes) {
            //update child
            await updateProductById({ productId, objectParams, model: furniture });
        }

        // 3 update the parent object
        const updatedProduct = await super.updateProduct({ productId, objectParams });
        
        return updatedProduct;

    }
}

ProductFactory.registerProductType('Electronics', Electronics);
ProductFactory.registerProductType('Clothing', Clothing);
ProductFactory.registerProductType('Furniture', Furniture);

module.exports = ProductFactory;
