/*
  Warnings:

  - You are about to drop the column `selected` on the `Inventory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[selected_inventory_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Inventory` DROP COLUMN `selected`,
    ADD COLUMN `experience` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `selected_inventory_id` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_selected_inventory_id_key` ON `User`(`selected_inventory_id`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_selected_inventory_id_fkey` FOREIGN KEY (`selected_inventory_id`) REFERENCES `Inventory`(`inventory_id`) ON DELETE SET NULL ON UPDATE CASCADE;
