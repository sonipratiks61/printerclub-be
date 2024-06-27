/*
  Warnings:

  - You are about to drop the column `addressId` on the `OrderCustomer` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `OrderCustomer` DROP FOREIGN KEY `OrderCustomer_addressId_fkey`;

-- AlterTable
ALTER TABLE `OrderCustomer` DROP COLUMN `addressId`;
