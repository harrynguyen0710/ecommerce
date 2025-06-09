const { INVENTORY_DEFAULT } = require("../constants/index");

function createInventoryEntries(variants, productId) {
    const inventoryEntries = [];

    for (const v of variants) {
        inventoryEntries.push({
            sku: v.sku,
            productId,
            quantity: INVENTORY_DEFAULT.QUANTITY,
            reserved: INVENTORY_DEFAULT.RESERVED,
            status: INVENTORY_DEFAULT.STATUS,
        });
    }

    return inventoryEntries;
}

module.exports = createInventoryEntries