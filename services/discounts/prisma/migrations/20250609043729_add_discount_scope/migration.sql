-- CreateEnum
CREATE TYPE "DiscountScope" AS ENUM ('ENTIRE_ORDER', 'SPECIFIC_SKUS');

-- AlterTable
ALTER TABLE "Discount" ADD COLUMN     "scope" "DiscountScope" NOT NULL DEFAULT 'ENTIRE_ORDER';
