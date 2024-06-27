/*
  Warnings:

  - You are about to drop the column `orderStatusId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `orderItemId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_orderStatusId_fkey`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `orderStatusId`,
    ADD COLUMN `orderItemId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `OrderItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
