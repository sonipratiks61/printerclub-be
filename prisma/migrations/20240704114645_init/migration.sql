/*
  Warnings:

  - Added the required column `ownerName` to the `OrderHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OrderHistory` ADD COLUMN `ownerName` VARCHAR(191) NOT NULL;
