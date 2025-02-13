-- AlterTable
ALTER TABLE `Attribute` ADD COLUMN `showToUser` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `assignedToId` INTEGER NULL,
    ADD COLUMN `attachmentType` VARCHAR(191) NULL,
    ADD COLUMN `deliveryDate` DATETIME(3) NULL,
    ADD COLUMN `expectedBy` DATETIME(3) NULL;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
