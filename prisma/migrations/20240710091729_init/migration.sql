/*
  Warnings:

  - You are about to drop the column `roleId` on the `Capability` table. All the data in the column will be lost.
  - Made the column `isFitmentRequired` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isMeasurementRequired` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Capability` DROP FOREIGN KEY `Capability_roleId_fkey`;

-- AlterTable
ALTER TABLE `Capability` DROP COLUMN `roleId`;

-- AlterTable
ALTER TABLE `Category` ADD COLUMN `includeSubCategory` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Product` MODIFY `isFitmentRequired` BOOLEAN NOT NULL,
    MODIFY `isMeasurementRequired` BOOLEAN NOT NULL;
