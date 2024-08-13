/*
  Warnings:

  - You are about to drop the column `attachmentId` on the `AttachmentAssociation` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `AttachmentAssociation` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `AttachmentAssociation` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `AttachmentAssociation` table. All the data in the column will be lost.
  - You are about to drop the column `path` on the `attachments` table. All the data in the column will be lost.
  - Added the required column `relationId` to the `AttachmentAssociation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `relationType` to the `AttachmentAssociation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fileName` to the `attachments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filePath` to the `attachments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `AttachmentAssociation` DROP FOREIGN KEY `AttachmentAssociation_attachmentId_fkey`;

-- DropForeignKey
ALTER TABLE `AttachmentAssociation` DROP FOREIGN KEY `AttachmentAssociation_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `AttachmentAssociation` DROP FOREIGN KEY `AttachmentAssociation_productId_fkey`;

-- DropForeignKey
ALTER TABLE `AttachmentAssociation` DROP FOREIGN KEY `AttachmentAssociation_userId_fkey`;

-- AlterTable
ALTER TABLE `AttachmentAssociation` DROP COLUMN `attachmentId`,
    DROP COLUMN `categoryId`,
    DROP COLUMN `productId`,
    DROP COLUMN `userId`,
    ADD COLUMN `relationId` INTEGER NOT NULL,
    ADD COLUMN `relationType` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `attachments` DROP COLUMN `path`,
    ADD COLUMN `fileName` VARCHAR(191) NOT NULL,
    ADD COLUMN `filePath` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `AttachmentToAssociation` (
    `attachmentId` INTEGER NOT NULL,
    `attachmentAssociationId` INTEGER NOT NULL,

    PRIMARY KEY (`attachmentId`, `attachmentAssociationId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AttachmentToAssociation` ADD CONSTRAINT `AttachmentToAssociation_attachmentId_fkey` FOREIGN KEY (`attachmentId`) REFERENCES `attachments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AttachmentToAssociation` ADD CONSTRAINT `AttachmentToAssociation_attachmentAssociationId_fkey` FOREIGN KEY (`attachmentAssociationId`) REFERENCES `AttachmentAssociation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
