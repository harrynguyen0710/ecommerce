-- CreateEnum
CREATE TYPE "UsageLogType" AS ENUM ('APPLIED', 'ROLLED_BACK');

-- CreateTable
CREATE TABLE "DiscountUsageLog" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "UsageLogType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscountUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscountUsageLog_orderId_code_type_key" ON "DiscountUsageLog"("orderId", "code", "type");
