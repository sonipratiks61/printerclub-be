/*
  Warnings:

  - You are about to drop the column `GSTNumber` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `gst` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OrderItem` DROP COLUMN `GSTNumber`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `gst` VARCHAR(191) NOT NULL,
    ADD COLUMN `measurement` VARCHAR(191) NULL;
