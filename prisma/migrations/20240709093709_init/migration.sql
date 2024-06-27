/*
  Warnings:

  - You are about to drop the column `orderCustomerId` on the `OrderItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `OrderItem` DROP FOREIGN KEY `OrderItem_orderCustomerId_fkey`;

-- AlterTable
ALTER TABLE `OrderItem` DROP COLUMN `orderCustomerId`;
