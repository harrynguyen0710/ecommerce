const kafka = require("../../config/kafka");

const topics = require("../topics");

const inventoryService = require("../../services/inventory.service");

const { GROUP_CONSUMERS } = require("../../constants/index");

const consumer = kafka.consumer({ groupId: GROUP_CONSUMERS.INVENTORY_BULK_CONSUMER_GROUP });

async function inventoryBulkCreatedConsumer() {
  await consumer.connect();

  console.log("✅ Connected to Kafka");

  await consumer.subscribe({
    topic: topics.INVENTORY_BULK_CREATED,
    fromBeginning: true,
  });

  console.log(`📡 Subscribed to topic: ${topics.INVENTORY_BULK_CREATED}`);

  await consumer.run({
    eachBatch: async ({
      batch,
      resolveOffset,
      heartbeat,
      commitOffsetsIfNecessary,
      isRunning,
      isStale,
    }) => {
      console.log(`Received batch from topic: ${batch.topic}`);

      const inventoryRecords = [];

      for (let message of batch.messages) {
        if (!isRunning() || isStale()) {
          break;
        }

        const parsed = JSON.parse(message.value.toString());
    

        for (const variant of parsed.variants) {
          inventoryRecords.push({
            sku: variant.sku,
            productId: parsed.productId,
            quantity:
              typeof variant.quantity === "number" ? variant.quantity : 0,
            reserved:
              typeof variant.reserved === "number" ? variant.reserved : 0,
            costPrice: variant.costPrice ?? null,
            status: "AVAILABLE",
          });
        }

        resolveOffset(message.offset);
      }

      if (inventoryRecords.length > 0) {
        await inventoryService.insertBulkInventory(inventoryRecords);
        console.log(`Inserted ${inventoryRecords.length} inventory records`);
      }

      await commitOffsetsIfNecessary();
      await heartbeat();
    },
  });
}

module.exports = inventoryBulkCreatedConsumer;
