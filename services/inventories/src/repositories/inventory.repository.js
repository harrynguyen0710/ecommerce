const { prisma } = require("../config/prisma");


async function createManyInventories(inventoryEntries) {
    await prisma.inventory.createMany({
        data: inventoryEntries,
        skipDuplicates: true, 
    });
}


module.exports = {
    createManyInventories,
}