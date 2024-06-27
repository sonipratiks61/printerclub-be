/*
  Warnings:

  - You are about to drop the column `invoiceVarient` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `orderHistoryId` on the `Order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[mobileNumber]` on the table `OrderCustomer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_orderHistoryId_fkey`;

-- AlterTable
ALTER TABLE `Order` DROP COLUMN `invoiceVarient`,
    DROP COLUMN `orderHistoryId`;

-- CreateIndex
CREATE UNIQUE INDEX `OrderCustomer_mobileNumber_key` ON `OrderCustomer`(`mobileNumber`);
