-- DropForeignKey
ALTER TABLE `OrderCustomer` DROP FOREIGN KEY `OrderCustomer_addressId_fkey`;

-- AlterTable
ALTER TABLE `OrderCustomer` MODIFY `addressId` INTEGER NULL,
    MODIFY `additionalDetails` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `OrderCustomer` ADD CONSTRAINT `OrderCustomer_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
