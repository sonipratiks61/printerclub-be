/*
  Warnings:

  - You are about to drop the column `pinCode` on the `OrderCustomer` table. All the data in the column will be lost.
  - Made the column `description` on table `Category` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `pincode` to the `OrderCustomer` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `OrderCustomer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `OrderCustomer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `OrderCustomer` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `OrderCustomer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Category` MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `OrderCustomer` DROP COLUMN `pinCode`,
    ADD COLUMN `pincode` VARCHAR(191) NOT NULL,
    MODIFY `address` VARCHAR(191) NOT NULL,
    MODIFY `city` VARCHAR(191) NOT NULL,
    MODIFY `state` VARCHAR(191) NOT NULL,
    MODIFY `country` VARCHAR(191) NOT NULL;
