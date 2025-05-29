const { prisma } = require("../../config/prisma");
const { producer } = require("../../config/kafka");

async function handleProductCreated({ productId, variants }, meta) {
  if (!productId || !Array.isArray(variants) || variants.length === 0) {
    throw new Error("Invalid productCreated payload");
  }

  console.log("on productCREATED HANDLER::", meta);

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

  const startTimestamp = meta?.startTimestamp || Date.now();
  const correlationId = meta?.correlationId || "unknown";

  try {
    console.time("start creating");
    await prisma.inventory.createMany({
      data: inventoryEntries,
      skipDuplicates: true,
    });
    console.timeEnd("start creating");

    console.log("startTimestamp::", startTimestamp);
    console.log("correlationId::", correlationId);

    // ✅ Send metrics to Kafka
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

module.exports = {
  handleProductCreated,
};
