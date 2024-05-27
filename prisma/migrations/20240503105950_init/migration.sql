/*
  Warnings:

  - You are about to drop the column `userId` on the `Role` table. All the data in the column will be lost.
  - The primary key for the `RoleAndCapabilityMapping` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `RoleAndCapabilityMapping` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Role` DROP FOREIGN KEY `Role_userId_fkey`;

-- AlterTable
ALTER TABLE `Role` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `RoleAndCapabilityMapping` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`capabilityId`, `roleId`);

-- AlterTable
ALTER TABLE `User` ADD COLUMN `roleId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
