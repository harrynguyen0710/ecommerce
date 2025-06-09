const createInventoryEntries = require("../../helpers/createInventoryEntries");

const {
  createManyInventories,
} = require("../../repositories/inventory.repository");

async function handleProductCreated({ productId, variants }, meta) {
  if (!productId || !Array.isArray(variants) || variants.length === 0) {
    throw new Error("Invalid productCreated payload");
  }

  try {
    const inventoryEntries = createInventoryEntries(variants, productId);
    await createManyInventories(inventoryEntries);
  } catch (error) {
    throw new Error(`Inventory insert failed: ${error.message}`);
  }
}

module.exports = handleProductCreated;
