/*
  Warnings:

  - You are about to drop the `_ActionsToTravelOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_ActionsToTravelOrder` DROP FOREIGN KEY `_ActionsToTravelOrder_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ActionsToTravelOrder` DROP FOREIGN KEY `_ActionsToTravelOrder_B_fkey`;

-- DropTable
DROP TABLE `_ActionsToTravelOrder`;

-- AddForeignKey
ALTER TABLE `Actions` ADD CONSTRAINT `Actions_travel_order_id_fkey` FOREIGN KEY (`travel_order_id`) REFERENCES `TravelOrder`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
