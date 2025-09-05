import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function seedTestData() {
  // Clean slate
  await prisma.inventory.deleteMany();
  await prisma.timer.deleteMany(); // Just in case
  await prisma.pokemon.deleteMany();
  await prisma.user.deleteMany();

  // Seed evolvable Pokémon (manually connected)
  const bulbasaur = await prisma.pokemon.create({
    data: {
      pokedex_id: 1,
      name: "Bulbasaur",
      nickname: "Bulbasaur",
      rarity: "COMMON",
      image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
      evolve_level: 16,
    },
  });

  const ivysaur = await prisma.pokemon.create({
    data: {
      pokedex_id: 2,
      name: "Ivysaur",
      nickname: "Ivysaur",
      rarity: "UNCOMMON",
      image_url: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
      evolve_level: 32,
      previous_evolutions: {
        connect: { pokemon_id: bulbasaur.pokemon_id },
      },
    },
  });

  // Link Bulbasaur → Ivysaur
  await prisma.pokemon.update({
    where: { pokemon_id: bulbasaur.pokemon_id },
    data: {
      next_evolution_id: ivysaur.pokemon_id,
    },
  });

  // Hash the password dynamically so tests always match
  const hashedPassword = await bcrypt.hash("testpassword", 10);

  // Add a test user
  const user = await prisma.user.create({
    data: {
      email: "ash@example.com",
      password: hashedPassword,
      username: "ashketchum",
    },
  });

  // Add Bulbasaur to the inventory
  await prisma.inventory.create({
    data: {
      user_id: user.user_id,
      pokemon_id: bulbasaur.pokemon_id,
    },
  });

  await prisma.$disconnect();
}
