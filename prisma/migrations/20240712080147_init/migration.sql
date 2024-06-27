/*
  Warnings:

  - You are about to drop the column `binding` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `colour` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `dieShape` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `envelopeCode` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `firstPaperQuality` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `flapOpening` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `halfCut` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `lamination` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `paperQuality` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `paperQuanlity` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `paperType` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `penType` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `pocket` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `printing` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `quanitity` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `secondCopyPaperColor` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `service` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `stickersCountPerSheet` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `textureType` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `thirdCopyPaperColor` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `windowCutting` on the `Attribute` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `Capability` table. All the data in the column will be lost.
  - You are about to drop the column `AmountPayable` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `cost` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `gst` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `categories` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Attribute` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `AttachmentAssociation` DROP FOREIGN KEY `AttachmentAssociation_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `Attribute` DROP FOREIGN KEY `Attribute_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Capability` DROP FOREIGN KEY `Capability_roleId_fkey`;

-- DropForeignKey
ALTER TABLE `Product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_userId_fkey`;

-- AlterTable
ALTER TABLE `Attribute` DROP COLUMN `binding`,
    DROP COLUMN `colour`,
    DROP COLUMN `dieShape`,
    DROP COLUMN `envelopeCode`,
    DROP COLUMN `firstPaperQuality`,
    DROP COLUMN `flapOpening`,
    DROP COLUMN `halfCut`,
    DROP COLUMN `lamination`,
    DROP COLUMN `paperQuality`,
    DROP COLUMN `paperQuanlity`,
    DROP COLUMN `paperType`,
    DROP COLUMN `penType`,
    DROP COLUMN `pocket`,
    DROP COLUMN `printing`,
    DROP COLUMN `productId`,
    DROP COLUMN `quanitity`,
    DROP COLUMN `secondCopyPaperColor`,
    DROP COLUMN `service`,
    DROP COLUMN `size`,
    DROP COLUMN `stickersCountPerSheet`,
    DROP COLUMN `textureType`,
    DROP COLUMN `thirdCopyPaperColor`,
    DROP COLUMN `windowCutting`,
    ADD COLUMN `name` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Capability` DROP COLUMN `roleId`;

-- AlterTable
ALTER TABLE `OrderStatus` MODIFY `dependOn` INTEGER NULL;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `AmountPayable`,
    DROP COLUMN `cost`,
    DROP COLUMN `gst`,
    DROP COLUMN `productName`,
    ADD COLUMN `description` TEXT NOT NULL,
    ADD COLUMN `isFitmentRequired` BOOLEAN NULL,
    ADD COLUMN `isMeasurementRequired` BOOLEAN NULL,
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `price` VARCHAR(191) NOT NULL,
    ADD COLUMN `quantity` JSON NULL;

-- DropTable
DROP TABLE `categories`;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `parentId` INTEGER NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `type` ENUM('service', 'physical') NOT NULL,
    `includeSubCategory` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductAttribute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('text', 'dropDown') NOT NULL,
    `options` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderCustomer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `additionalDetails` VARCHAR(191) NULL,
    `mobileNumber` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `orderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `additionalDetails` TEXT NULL,
    `description` TEXT NOT NULL,
    `attributes` JSON NULL,
    `ownerName` VARCHAR(191) NOT NULL,
    `gst` INTEGER NOT NULL,
    `measurement` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `discount` INTEGER NULL,
    `orderId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Order` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `advancePayment` DECIMAL(65, 30) NOT NULL,
    `remainingPayment` DECIMAL(65, 30) NOT NULL,
    `totalPayment` DECIMAL(65, 30) NOT NULL,
    `ownerName` VARCHAR(191) NOT NULL,
    `paymentMode` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OrderHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NOT NULL,
    `ownerName` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `orderId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Attribute_name_key` ON `Attribute`(`name`);

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductAttribute` ADD CONSTRAINT `ProductAttribute_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttachmentAssociation` ADD CONSTRAINT `AttachmentAssociation_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderStatus` ADD CONSTRAINT `OrderStatus_dependOn_fkey` FOREIGN KEY (`dependOn`) REFERENCES `OrderStatus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderCustomer` ADD CONSTRAINT `OrderCustomer_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderHistory` ADD CONSTRAINT `OrderHistory_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
