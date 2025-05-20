const { prisma } = require("../../config/prisma");

async function handleProductCreated({ productId, variants }) {
  const inventoryEntries = variants.map((v) => ({
    sku: v.sku,
    productId,
    quantity: 0,
    reserved: 0,
    status: "AVAILABLE",
  }));

  for (const entry of inventoryEntries) {
    try {
      await prisma.inventory.create({ data: entry });
      console.log(`✅ Inventory created for product ${productId}`);
    } catch (error) {
      if (error.code === "P2002") {
        console.warn(`⚠️ SKU '${entry.sku}' already exists. Skipping.`);
      } else {
        throw error;
      }
    }
  }
}

module.exports = {
  handleProductCreated,
};
