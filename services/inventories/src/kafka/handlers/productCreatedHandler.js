const { prisma } = require("../../config/prisma");

async function handleProductCreated({ productId, variants }) {
  if (!productId || !Array.isArray(variants) || variants.length === 0) {
    throw new Error("Invalid productCreated payload");
  }

  const inventoryEntries = [];

  for (const v of variants) {
    if (!v.sku || typeof v.sku !== "string") {
      throw new Error(
        `Invalid or missing SKU for variant: ${JSON.stringify(v)}`
      );
    }

    inventoryEntries.push({
      sku: v.sku,
      productId,
      quantity: 0,
      reserved: 0,
      status: "AVAILABLE",
    });
  }

  try {
    const result = await prisma.inventory.createMany({
      data: inventoryEntries,
      skipDuplicates: true,
    });

    console.log(`✅ Bulk inventory insert: ${result.count} new items added.`);
  } catch (error) {
    console.error("❌ Error inserting inventory in bulk:", error);
    throw error;
  }
}

module.exports = {
  handleProductCreated,
};
