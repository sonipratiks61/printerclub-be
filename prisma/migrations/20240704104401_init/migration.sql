/*
  Warnings:

  - Added the required column `invoiceVarient` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `invoiceVarient` VARCHAR(191) NOT NULL;
