/*
  Warnings:

  - Added the required column `orderCustomerId` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Address` ADD COLUMN `orderCustomerId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `country` VARCHAR(191) NULL,
    ADD COLUMN `pinCode` VARCHAR(191) NULL,
    ADD COLUMN `state` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_orderCustomerId_fkey` FOREIGN KEY (`orderCustomerId`) REFERENCES `OrderCustomer`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
