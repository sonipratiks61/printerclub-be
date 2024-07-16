/*
  Warnings:

  - You are about to drop the column `address` on the `OrderCustomer` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `OrderCustomer` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `OrderCustomer` table. All the data in the column will be lost.
  - You are about to drop the column `pinCode` on the `OrderCustomer` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `OrderCustomer` table. All the data in the column will be lost.
  - Added the required column `customerId` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Address` ADD COLUMN `customerId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OrderCustomer` DROP COLUMN `address`,
    DROP COLUMN `city`,
    DROP COLUMN `country`,
    DROP COLUMN `pinCode`,
    DROP COLUMN `state`;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `OrderCustomer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
