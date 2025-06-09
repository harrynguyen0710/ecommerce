
async function getInventoryBySku(tx, sku) {
  return tx.inventory.findUnique({ where: { sku } });
}

async function revertReserve(tx, item) {
  const sku = item.sku;
  const quantity = Number(item.quantity);

  const inventory = await getInventoryBySku(tx, sku);
  if (!inventory) {
    throw new Error(`No inventory found for SKU: ${sku}`);
  }

  await tx.inventory.update({
    where: { sku },
    data: {
      quantity: { increment: quantity },
      reserved: { decrement: Math.min(quantity, inventory.reserved) },
    },
  });
}

async function confirmBuy(tx, item) {
  const sku = item.sku;
  const quantity = Number(item.quantity);

  const inventory = await getInventoryBySku(tx, sku);
  if (!inventory || inventory.reserved < quantity) {
    throw new Error(`Not enough reserved stock for SKU: ${sku}`);
  }

  await tx.inventory.update({
    where: { sku },
    data: {
      reserved: { decrement: quantity },
    },
  });
}

async function reserveInventory(tx, item) {
  const sku = item.sku;
  const quantity = Number(item.quantity);

  const inventory = await getInventoryBySku(tx, sku);
  if (!inventory || inventory.quantity < quantity) {
    throw new Error(`Not enough stock for SKU: ${sku}`);
  }

  await tx.inventory.update({
    where: { sku },
    data: {
      quantity: { decrement: quantity },
      reserved: { increment: quantity },
    },
  });
}

module.exports = {
  reserveInventory,
  confirmBuy,
  revertReserve,
};
