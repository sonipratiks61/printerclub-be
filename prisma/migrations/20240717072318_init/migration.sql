/*
  Warnings:

  - You are about to drop the column `orderCustomerId` on the `Address` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_orderCustomerId_fkey`;

-- AlterTable
ALTER TABLE `Address` DROP COLUMN `orderCustomerId`;
