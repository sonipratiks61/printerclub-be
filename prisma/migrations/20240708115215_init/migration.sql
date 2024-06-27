-- AlterTable
ALTER TABLE `OrderStatus` MODIFY `dependOn` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `OrderStatus` ADD CONSTRAINT `OrderStatus_dependOn_fkey` FOREIGN KEY (`dependOn`) REFERENCES `OrderStatus`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
