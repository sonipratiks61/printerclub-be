-- AlterTable
ALTER TABLE `Address` ADD COLUMN `orderCustomerId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_orderCustomerId_fkey` FOREIGN KEY (`orderCustomerId`) REFERENCES `OrderCustomer`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
