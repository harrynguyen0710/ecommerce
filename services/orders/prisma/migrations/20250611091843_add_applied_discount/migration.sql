-- CreateTable
CREATE TABLE "AppliedDiscounts" (
    "id" TEXT NOT NULL,
    "discountCode" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "AppliedDiscounts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AppliedDiscounts" ADD CONSTRAINT "AppliedDiscounts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
