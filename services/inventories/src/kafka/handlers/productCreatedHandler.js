const { prisma } = require("../../config/prisma");
const { getConnectedProducer } = require("../producer"); // assume this returns a connected producer


async function handleProductCreated({ productId, variants }, meta) {
  const { correlationId, startTimestamp } = meta;

  if (!productId || !Array.isArray(variants) || variants.length === 0) {
    throw new Error("Invalid productCreated payload");
  }


  const inventoryEntries = [];

  try {
    console.time("start creating");
    await prisma.inventory.createMany({
      data: inventoryEntries,
      skipDuplicates: true,
    });

    const producer = await getConnectedProducer(); // ✅ fix here

    await producer.send({
      topic: "metrics.inventory-service",
      messages: [
        {
          value: JSON.stringify({
            service: "inventory-service",
            event: "product.created",
            latencyMs: Date.now() - startTimestamp,
            recordCount: inventoryEntries.length,
            timestamp: new Date().toISOString(),
            correlationId,
          }),
        },
      ],
    });
  } catch (error) {
    throw new Error(`Inventory insert failed: ${error.message}`);
  }
}

module.exports = handleProductCreated;
