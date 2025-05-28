async function handleProductCreated({ productId, variants }, meta) {
  const { correlationId, startTimestamp } = meta;

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
    await prisma.inventory.createMany({
      data: inventoryEntries,
      skipDuplicates: true,
    });

    await trackBulkInsertProgress({
      correlationId,
      startTimestamp,
    });
  } catch (error) {
    throw new Error(`Inventory insert failed: ${error.message}`);
  }
}
