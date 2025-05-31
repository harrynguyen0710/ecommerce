const createInventoryEntries = require("../../helpers/createInventoryEntries");

const { SERVICE_INFOR } = require("../../constants/index");

const logMetrics = require("../../utils/logMetrics");

const {
  createManyInventories,
} = require("../../repositories/inventory.repository");

async function handleProductCreated({ productId, variants }, meta) {
  const { correlationId, startTimestamp } = meta;
  console.log('productId::', productId);
  console.log('variants::',variants);

  console.log('meta::', meta);

  if (!productId || !Array.isArray(variants) || variants.length === 0) {
    throw new Error("Invalid productCreated payload");
  }

  try {
    
    const inventoryEntries = createInventoryEntries(variants, productId);
    console.log('inventory entry::', inventoryEntries)
    await createManyInventories(inventoryEntries);

    console.log('DONE');

    await logMetrics({
        service: SERVICE_INFOR.NAME,
        event: SERVICE_INFOR.EVENT,
        startTimestamp,
        correlationId,
        recordCount: inventoryEntries.length,
    });

    
  } catch (error) {
    throw new Error(`Inventory insert failed: ${error.message}`);
  }
}

module.exports = handleProductCreated;
