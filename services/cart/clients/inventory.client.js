const axios = require("axios");

const INVENTORY_BASE_URL  = process.env.INVENTORY_BASE_URL;


const getInventoryBySKUs = async (skus) => {
  const url = `${INVENTORY_BASE_URL}/inventory/skus=${skus.join(',')}`;
  const response = await axios.get(url)

  return response.data; 
};

module.exports = { getInventoryBySKUs };