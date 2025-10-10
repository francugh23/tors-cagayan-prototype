/*
  Warnings:

  - Added the required column `position` to the `TravelOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TravelOrder` ADD COLUMN `position` VARCHAR(191) NOT NULL;
