/*
  Warnings:

  - You are about to drop the column `orderId` on the `OrderHistory` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `OrderItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `OrderHistory` DROP FOREIGN KEY `OrderHistory_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_orderId_fkey`;

-- AlterTable
ALTER TABLE `OrderHistory` DROP COLUMN `orderId`;

-- AlterTable
ALTER TABLE `OrderItem` DROP COLUMN `orderId`;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_orderHistoryId_fkey` FOREIGN KEY (`orderHistoryId`) REFERENCES `OrderHistory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
