/*
  Warnings:

  - You are about to drop the column `attachmentType` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Attachment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Attachment` table. All the data in the column will be lost.
  - Added the required column `attrachmentType` to the `Attachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Attachment` DROP COLUMN `attachmentType`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `attachmentType` VARCHAR(191) NOT NULL;
