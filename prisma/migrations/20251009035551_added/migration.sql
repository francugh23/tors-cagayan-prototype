/*
  Warnings:

  - Added the required column `requester_name` to the `TravelOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TravelOrder` ADD COLUMN `requester_name` VARCHAR(191) NOT NULL;
