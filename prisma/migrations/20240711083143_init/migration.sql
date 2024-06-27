/*
  Warnings:

  - You are about to drop the column `roleId` on the `Capability` table. All the data in the column will be lost.
  - You are about to drop the column `includeSubCategory` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Capability` DROP FOREIGN KEY `Capability_roleId_fkey`;

-- DropIndex
DROP INDEX `OrderStatus_dependOn_fkey` ON `OrderStatus`;

-- AlterTable
ALTER TABLE `Capability` DROP COLUMN `roleId`;

-- AlterTable
ALTER TABLE `Category` DROP COLUMN `includeSubCategory`;
