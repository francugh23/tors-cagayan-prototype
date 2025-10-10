/*
  Warnings:

  - You are about to drop the column `signature` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `station_id` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `users` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `Enum(EnumId(0))`.
  - You are about to drop the `Position` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `actions_history` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `travel_orders` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `designation_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `actions_history` DROP FOREIGN KEY `actions_history_travel_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `actions_history` DROP FOREIGN KEY `actions_history_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `travel_orders` DROP FOREIGN KEY `travel_orders_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_position_id_fkey`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_station_id_fkey`;

-- DropIndex
DROP INDEX `users_position_id_fkey` ON `users`;

-- DropIndex
DROP INDEX `users_station_id_fkey` ON `users`;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `signature`,
    DROP COLUMN `station_id`,
    ADD COLUMN `designation_id` VARCHAR(191) NOT NULL,
    MODIFY `role` ENUM('ADMIN', 'ACCOUNT_HOLDER', 'SIGNATORY') NOT NULL DEFAULT 'ACCOUNT_HOLDER',
    MODIFY `position_id` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Position`;

-- DropTable
DROP TABLE `actions_history`;

-- DropTable
DROP TABLE `stations`;

-- DropTable
DROP TABLE `travel_orders`;

-- CreateTable
CREATE TABLE `TravelOrder` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `request_type` ENUM('WITHIN_DIVISION', 'OUTSIDE_DIVISION') NOT NULL,
    `requester_id` VARCHAR(191) NOT NULL,
    `purpose` VARCHAR(191) NOT NULL,
    `host` VARCHAR(191) NOT NULL,
    `travel_period` VARCHAR(191) NOT NULL,
    `destination` VARCHAR(191) NOT NULL,
    `fund_source` VARCHAR(191) NOT NULL,
    `attached_file` VARCHAR(191) NOT NULL,
    `authority_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `TravelOrder_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `designations` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('SDO', 'ELEMENTARY', 'SECONDARY') NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `designations_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `positions` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('SDS', 'ASDS_ELEM', 'ASDS_SEC', 'SCHOOL_HEAD') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `positions_type_key`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `authorities` (
    `id` VARCHAR(191) NOT NULL,
    `request_type` ENUM('WITHIN_DIVISION', 'OUTSIDE_DIVISION') NOT NULL,
    `designation_type` ENUM('SDO', 'ELEMENTARY', 'SECONDARY') NOT NULL,
    `recommending_position_id` VARCHAR(191) NULL,
    `approving_position_id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Actions` (
    `id` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `travel_order_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `remarks` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ActionsToUser` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ActionsToUser_AB_unique`(`A`, `B`),
    INDEX `_ActionsToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ActionsToTravelOrder` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ActionsToTravelOrder_AB_unique`(`A`, `B`),
    INDEX `_ActionsToTravelOrder_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_designation_id_fkey` FOREIGN KEY (`designation_id`) REFERENCES `designations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_position_id_fkey` FOREIGN KEY (`position_id`) REFERENCES `positions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TravelOrder` ADD CONSTRAINT `TravelOrder_requester_id_fkey` FOREIGN KEY (`requester_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TravelOrder` ADD CONSTRAINT `TravelOrder_authority_id_fkey` FOREIGN KEY (`authority_id`) REFERENCES `authorities`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `authorities` ADD CONSTRAINT `authorities_recommending_position_id_fkey` FOREIGN KEY (`recommending_position_id`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `authorities` ADD CONSTRAINT `authorities_approving_position_id_fkey` FOREIGN KEY (`approving_position_id`) REFERENCES `positions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ActionsToUser` ADD CONSTRAINT `_ActionsToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `Actions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ActionsToUser` ADD CONSTRAINT `_ActionsToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ActionsToTravelOrder` ADD CONSTRAINT `_ActionsToTravelOrder_A_fkey` FOREIGN KEY (`A`) REFERENCES `Actions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ActionsToTravelOrder` ADD CONSTRAINT `_ActionsToTravelOrder_B_fkey` FOREIGN KEY (`B`) REFERENCES `TravelOrder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
