/*
  Warnings:

  - Added the required column `GST` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `advancePayment` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remainingPayment` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPayment` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `GST` VARCHAR(191) NOT NULL,
    ADD COLUMN `advancePayment` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `ownerName` VARCHAR(191) NOT NULL,
    ADD COLUMN `remainingPayment` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `totalPayment` DECIMAL(65, 30) NOT NULL;
