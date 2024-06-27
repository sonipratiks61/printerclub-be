/*
  Warnings:

  - You are about to drop the column `includeSubCategory` on the `Category` table. All the data in the column will be lost.
  - Added the required column `roleId` to the `Capability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Capability` ADD COLUMN `roleId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Category` DROP COLUMN `includeSubCategory`;

-- AlterTable
ALTER TABLE `OrderItem` MODIFY `additionalDetails` TEXT NULL;

-- AlterTable
ALTER TABLE `Product` MODIFY `isFitmentRequired` BOOLEAN NULL,
    MODIFY `isMeasurementRequired` BOOLEAN NULL;

-- AddForeignKey
ALTER TABLE `Capability` ADD CONSTRAINT `Capability_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
