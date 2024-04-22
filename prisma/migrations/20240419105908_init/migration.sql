-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `categoryId` INTEGER NOT NULL,
    `productName` VARCHAR(191) NOT NULL,
    `cost` VARCHAR(191) NOT NULL,
    `gst` VARCHAR(191) NOT NULL,
    `AmountPayable` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attribute` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `quanitity` INTEGER NOT NULL,
    `printing` VARCHAR(191) NOT NULL,
    `dieShape` VARCHAR(191) NOT NULL,
    `textureType` VARCHAR(191) NOT NULL,
    `paperQuality` VARCHAR(191) NOT NULL,
    `colour` VARCHAR(191) NOT NULL,
    `paperQuanlity` VARCHAR(191) NOT NULL,
    `pocket` VARCHAR(191) NOT NULL,
    `binding` VARCHAR(191) NOT NULL,
    `envelopeCode` VARCHAR(191) NOT NULL,
    `flapOpening` VARCHAR(191) NOT NULL,
    `windowCutting` VARCHAR(191) NOT NULL,
    `paperType` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `lamination` VARCHAR(191) NOT NULL,
    `halfCut` VARCHAR(191) NOT NULL,
    `firstPaperQuality` VARCHAR(191) NOT NULL,
    `secondCopyPaperColor` VARCHAR(191) NOT NULL,
    `thirdCopyPaperColor` VARCHAR(191) NOT NULL,
    `stickersCountPerSheet` VARCHAR(191) NOT NULL,
    `penType` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Attribute` ADD CONSTRAINT `Attribute_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
