const axios = require("axios");

const CART_BASE_URL = process.env.CART_BASE_URL;

async function fetchUserCart(token) {
    const url = `${CART_BASE_URL}/cart`;
    const res = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return res.items
}

async function validateAndLock(token) {
    const url = `${CART_BASE_URL}/cart/validate-and-lock`;
    const res = await axios.post(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return res.cart;
}

module.exports = {
    fetchUserCart,
    validateAndLock,
    
};