/*
  Warnings:

  - You are about to drop the column `orderCustomerId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `OrderCustomer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_orderCustomerId_fkey`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `orderCustomerId`;

-- AlterTable
ALTER TABLE `OrderCustomer` ADD COLUMN `orderId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `OrderCustomer` ADD CONSTRAINT `OrderCustomer_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
