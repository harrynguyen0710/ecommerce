const axios = require("axios");

const CART_BASE_URL = process.env.CART_BASE_URL;

async function fetchUserCart(token) {
    const url = `${CART_BASE_URL}/cart`
    const res = await axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    return res.items
}

module.exports = fetchUserCart;