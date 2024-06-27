/*
  Warnings:

  - You are about to drop the column `includeSubCategory` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderCustomer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderItem` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `dependOn` on table `OrderStatus` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isFitmentRequired` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isMeasurementRequired` on table `Product` required. This step will fail if there are existing NULL values in that column.

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
ALTER TABLE `Category` DROP COLUMN `includeSubCategory`,
    MODIFY `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `OrderStatus` MODIFY `dependOn` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `isFitmentRequired` BOOLEAN NOT NULL,
    MODIFY `isMeasurementRequired` BOOLEAN NOT NULL;

-- DropTable
DROP TABLE `Order`;

-- DropTable
DROP TABLE `OrderCustomer`;

-- DropTable
DROP TABLE `OrderHistory`;

-- DropTable
DROP TABLE `OrderItem`;
