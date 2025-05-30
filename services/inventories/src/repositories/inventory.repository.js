const { prisma } = require("../config/prisma");


async function createManyInventory(inventoryEntries) {
    await prisma.inventory.createMany({
        data: inventoryEntries,
    });
}


module.exports = {
    createManyInventory,
}