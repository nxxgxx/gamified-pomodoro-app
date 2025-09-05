-- CreateTable
CREATE TABLE `User` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pokemon` (
    `pokemon_id` INTEGER NOT NULL AUTO_INCREMENT,
    `pokedex_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL,
    `rarity` ENUM('COMMON', 'UNCOMMON', 'RARE', 'LEGENDARY') NOT NULL,
    `image_url` VARCHAR(191) NOT NULL,
    `next_evolution_id` INTEGER NULL,
    `evolve_level` INTEGER NULL,

    UNIQUE INDEX `Pokemon_name_key`(`name`),
    PRIMARY KEY (`pokemon_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventory` (
    `inventory_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `pokemon_id` INTEGER NOT NULL,
    `nickname` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`inventory_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Timer` (
    `timer_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`timer_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pokemon` ADD CONSTRAINT `Pokemon_next_evolution_id_fkey` FOREIGN KEY (`next_evolution_id`) REFERENCES `Pokemon`(`pokemon_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_pokemon_id_fkey` FOREIGN KEY (`pokemon_id`) REFERENCES `Pokemon`(`pokemon_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Timer` ADD CONSTRAINT `Timer_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
