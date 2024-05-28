/*
  Warnings:

  - Added the required column `service` to the `Attribute` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Attribute` ADD COLUMN `service` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `Category` ADD COLUMN `parentId` INTEGER NOT NULL,
    ADD COLUMN `type` ENUM('service', 'physical') NOT NULL;
