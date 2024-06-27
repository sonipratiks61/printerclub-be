/*
  Warnings:

  - Added the required column `invoiceVarient` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderHistoryId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `invoiceVarient` VARCHAR(191) NOT NULL,
    ADD COLUMN `orderHistoryId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_orderHistoryId_fkey` FOREIGN KEY (`orderHistoryId`) REFERENCES `OrderHistory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
