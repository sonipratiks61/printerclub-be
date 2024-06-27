/*
  Warnings:

  - You are about to drop the column `GST` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `Order` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `OrderStatus` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.
  - Added the required column `GST` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` DROP COLUMN `GST`,
    DROP COLUMN `discount`;

-- AlterTable
ALTER TABLE `OrderItem` ADD COLUMN `GST` VARCHAR(191) NOT NULL,
    ADD COLUMN `description` TEXT NOT NULL,
    ADD COLUMN `discount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `OrderStatus` MODIFY `status` ENUM('OrderConfirm', 'Dispatched', 'Received', 'Delivered', 'Cancelled') NOT NULL;
