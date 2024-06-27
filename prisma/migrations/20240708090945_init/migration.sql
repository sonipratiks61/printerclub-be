/*
  Warnings:

  - You are about to drop the column `GST` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `GSTNumber` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OrderItem` DROP COLUMN `GST`,
    ADD COLUMN `GSTNumber` VARCHAR(191) NOT NULL;
