-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('AVAILABLE', 'OUT_OF_STOCK', 'RESERVED', 'DISCONTINUED');

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "costPrice" DOUBLE PRECISION,
    "status" "InventoryStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_sku_key" ON "Inventory"("sku");
