/*
  Warnings:

  - You are about to drop the column `orderCustomerId` on the `Address` table. All the data in the column will be lost.
  - You are about to alter the column `invoiceNumber` on the `Order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the column `city` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `pinCode` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `OrderItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Address` DROP FOREIGN KEY `Address_orderCustomerId_fkey`;

-- AlterTable
ALTER TABLE `Address` DROP COLUMN `orderCustomerId`;

-- AlterTable
ALTER TABLE `Order` MODIFY `invoiceNumber` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OrderItem` DROP COLUMN `city`,
    DROP COLUMN `country`,
    DROP COLUMN `pinCode`,
    DROP COLUMN `state`;
