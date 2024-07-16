/*
  Warnings:

  - You are about to drop the column `customerId` on the `Address` table. All the data in the column will be lost.
  - Added the required column `address` to the `OrderCustomer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `OrderCustomer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `OrderCustomer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pinCode` to the `OrderCustomer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `OrderCustomer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_customerId_fkey`;

-- AlterTable
ALTER TABLE `Address` DROP COLUMN `customerId`;

