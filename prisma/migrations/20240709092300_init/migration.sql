/*
  Warnings:

  - You are about to drop the column `invoiceVarient` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderHistoryId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderItemId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `OrderHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_orderHistoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_orderItemId_fkey`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `invoiceVarient`,
    DROP COLUMN `orderHistoryId`,
    DROP COLUMN `orderItemId`;

-- AlterTable
ALTER TABLE `OrderHistory` ADD COLUMN `orderId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `orderCustomerId` INTEGER NULL,
    ADD COLUMN `orderId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderCustomerId_fkey` FOREIGN KEY (`orderCustomerId`) REFERENCES `OrderCustomer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderHistory` ADD CONSTRAINT `OrderHistory_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
