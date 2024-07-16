/*
  Warnings:

  - You are about to drop the column `pincode` on the `OrderCustomer` table. All the data in the column will be lost.
  - Added the required column `pinCode` to the `OrderCustomer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `OrderCustomer` DROP COLUMN `pincode`,
    ADD COLUMN `pinCode` VARCHAR(191) NOT NULL;
