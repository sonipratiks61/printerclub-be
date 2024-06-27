/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderCustomer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `roleId` to the `Capability` table without a default value. This is not possible if the table is not empty.
  - Made the column `dependOn` on table `OrderStatus` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `OrderCustomer` DROP FOREIGN KEY `OrderCustomer_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderHistory` DROP FOREIGN KEY `OrderHistory_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_orderId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_productId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderStatus` DROP FOREIGN KEY `OrderStatus_dependOn_fkey`;

-- AlterTable
ALTER TABLE `Capability` ADD COLUMN `roleId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OrderStatus` MODIFY `dependOn` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Order`;

-- DropTable
DROP TABLE `OrderCustomer`;

-- DropTable
DROP TABLE `OrderHistory`;

-- DropTable
DROP TABLE `OrderItem`;

-- AddForeignKey
ALTER TABLE `Capability` ADD CONSTRAINT `Capability_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
