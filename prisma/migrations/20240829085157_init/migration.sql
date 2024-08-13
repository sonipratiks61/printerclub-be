/*
  Warnings:

  - You are about to drop the column `orderCustomerId` on the `Address` table. All the data in the column will be lost.
  - You are about to alter the column `invoiceNumber` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `orderId` on the `OrderHistory` table. All the data in the column will be lost.
  - You are about to drop the column `ownerName` on the `OrderHistory` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `OrderHistory` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `pinCode` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ProductAttribute` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[addressId]` on the table `OrderCustomer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orderId]` on the table `OrderCustomer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[isMeasurementAddressId]` on the table `OrderItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressId` to the `OrderCustomer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderItemId` to the `OrderHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusId` to the `OrderHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedById` to the `OrderHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderItemStatus` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workflowId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gst` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workflowId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attributeId` to the `ProductAttribute` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_orderCustomerId_fkey`;

-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_userId_fkey`;

-- DropForeignKey
ALTER TABLE `OrderHistory` DROP FOREIGN KEY `OrderHistory_orderId_fkey`;

-- AlterTable
ALTER TABLE `Address` DROP COLUMN `orderCustomerId`,
    MODIFY `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Order` MODIFY `invoiceNumber` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OrderCustomer` ADD COLUMN `addressId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OrderHistory` DROP COLUMN `orderId`,
    DROP COLUMN `ownerName`,
    DROP COLUMN `status`,
    ADD COLUMN `orderItemId` INTEGER NOT NULL,
    ADD COLUMN `statusId` INTEGER NOT NULL,
    ADD COLUMN `updatedById` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OrderItem` DROP COLUMN `address`,
    DROP COLUMN `city`,
    DROP COLUMN `country`,
    DROP COLUMN `pinCode`,
    DROP COLUMN `state`,
    ADD COLUMN `isMeasurementAddressId` INTEGER NULL,
    ADD COLUMN `orderItemStatus` VARCHAR(191) NOT NULL,
    ADD COLUMN `workflowId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OrderStatus` MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `Product` ADD COLUMN `discount` INTEGER NULL,
    ADD COLUMN `gst` INTEGER NOT NULL,
    ADD COLUMN `workflowId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `ProductAttribute` DROP COLUMN `name`,
    ADD COLUMN `attributeId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `RoleAndOrderStatusMapping` (
    `orderStatusId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`orderStatusId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkFlow` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `sequence` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `OrderCustomer_addressId_key` ON `OrderCustomer`(`addressId`);

-- CreateIndex
CREATE UNIQUE INDEX `OrderCustomer_orderId_key` ON `OrderCustomer`(`orderId`);

-- CreateIndex
CREATE UNIQUE INDEX `OrderItem_isMeasurementAddressId_key` ON `OrderItem`(`isMeasurementAddressId`);

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleAndOrderStatusMapping` ADD CONSTRAINT `RoleAndOrderStatusMapping_orderStatusId_fkey` FOREIGN KEY (`orderStatusId`) REFERENCES `OrderStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RoleAndOrderStatusMapping` ADD CONSTRAINT `RoleAndOrderStatusMapping_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_workflowId_fkey` FOREIGN KEY (`workflowId`) REFERENCES `WorkFlow`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductAttribute` ADD CONSTRAINT `ProductAttribute_attributeId_fkey` FOREIGN KEY (`attributeId`) REFERENCES `Attribute`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderCustomer` ADD CONSTRAINT `OrderCustomer_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_isMeasurementAddressId_fkey` FOREIGN KEY (`isMeasurementAddressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_workflowId_fkey` FOREIGN KEY (`workflowId`) REFERENCES `WorkFlow`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderHistory` ADD CONSTRAINT `OrderHistory_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
