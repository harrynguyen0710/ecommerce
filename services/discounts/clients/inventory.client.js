const axios = require('axios');

const INVENTORY_BASE_URL = process.env.INVENTORY_SERVICE_URL;

const getSkusByProductID = async (productIds) => {
  console.log('getSkusByProductID productIds', productIds);
  console.log('inventory service url', INVENTORY_BASE_URL);
  const url = `${INVENTORY_BASE_URL}/internal/inventory/skus?productIds=${productIds.join(',')}`;
  const response = await axios.get(url)

  return response.data; 
};

module.exports = { getSkusByProductID };