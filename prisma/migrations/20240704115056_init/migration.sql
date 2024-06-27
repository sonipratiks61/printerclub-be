/*
  Warnings:

  - You are about to drop the column `userId` on the `OrderHistory` table. All the data in the column will be lost.
  - Added the required column `ownerName` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `OrderHistory` DROP FOREIGN KEY `OrderHistory_userId_fkey`;

-- AlterTable
ALTER TABLE `OrderHistory` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `ownerName` VARCHAR(191) NOT NULL;
