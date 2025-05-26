const axios = require('axios');

const INVENTORY_BASE_URL = process.env.INVENTORY_SERVICE_URL;

const getInventoryBySkus = async (skus) => {
  console.log(INVENTORY_BASE_URL)
  const url = `${INVENTORY_BASE_URL}/inventory?skus=${skus.join(',')}`;
  const response = await axios.get(url);
  console.log('getInventoryBySkus', response.data);
  return response.data; // { SKU1: {...}, SKU2: {...} }
};

module.exports = { getInventoryBySkus };