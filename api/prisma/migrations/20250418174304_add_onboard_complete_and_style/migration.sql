-- AlterTable
ALTER TABLE `User` ADD COLUMN `current_style` VARCHAR(191) NULL,
    ADD COLUMN `onboard_complete` BOOLEAN NOT NULL DEFAULT false;
