/*
  Warnings:

  - Added the required column `showToUser` to the `OrderStatus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OrderStatus` ADD COLUMN `showToUser` BOOLEAN NOT NULL;
