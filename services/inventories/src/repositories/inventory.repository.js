const { prisma } = require("../config/prisma");

async function createManyInventories(inventoryEntries) {
  await prisma.inventory.createMany({
    data: inventoryEntries,
    skipDuplicates: true,
  });
}

async function getInventoryBySku(sku) {
  const inventory = await prisma.inventory.findUnique({
    where: sku,
  });

  return inventory;
}

async function revertReserve(item) {
  const sku = item.sku;
  const quantity = Number(item.quantity);

  const inventory = await getInventoryBySku(sku);
  if (!inventory) {
    throw new Error(`No inventory found for SKU: ${sku}`);
  }

  await prisma.inventory.update({
    where: { sku },
    data: {
      quantity: { increment: quantity },
      reserved: { decrement: Math.min(quantity, inventory.reserved) },
    },
  });
}

async function confirmBuy(item) {
  const sku = item.sku;
  const quantity = Number(item.quantity);

  const inventory = await getInventoryBySku(sku);
  if (!inventory || inventory.reserved < quantity) {
    throw new Error(`Not enough reserved stock for SKU: ${sku}`);
  }

  await prisma.inventory.update({
    where: { sku },
    data: {
      reserved: { decrement: quantity },
    },
  });
}

async function reserveInventory(item) {
  const sku = item.sku;
  const quantity = Number(item.quantity);

  const inventory = await getInventoryBySku(sku);
  if (!inventory || inventory.quantity < quantity) {
    throw new Error(`Not enough stock for SKU: ${sku}`);
  }

  await prisma.inventory.update({
    where: { sku },
    data: {
      quantity: { decrement: quantity },
      reserved: { increment: quantity },
    },
  });
}

module.exports = {
  createManyInventories,
  getInventoryBySku,
};
