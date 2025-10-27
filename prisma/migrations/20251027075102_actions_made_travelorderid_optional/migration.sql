-- DropForeignKey
ALTER TABLE `Actions` DROP FOREIGN KEY `Actions_travel_order_id_fkey`;

-- DropIndex
DROP INDEX `Actions_travel_order_id_fkey` ON `Actions`;

-- AlterTable
ALTER TABLE `Actions` MODIFY `travel_order_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Actions` ADD CONSTRAINT `Actions_travel_order_id_fkey` FOREIGN KEY (`travel_order_id`) REFERENCES `TravelOrder`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
