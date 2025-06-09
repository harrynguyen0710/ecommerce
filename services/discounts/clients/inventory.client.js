const axios = require('axios');

const INVENTORY_BASE_URL = process.env.INVENTORY_SERVICE_URL;

const getSkusByProductID = async (productIds) => {
  const url = `${INVENTORY_BASE_URL}/internal/inventory/skus?productIds=${productIds.join(',')}`;
  const response = await axios.get(url)

  return response.data; 
};

module.exports = { getSkusByProductID };