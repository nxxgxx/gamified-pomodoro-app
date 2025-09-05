import { PrismaClient } from "@prisma/client";
import { seedTestData } from "./test.seed.js";

const prisma = new PrismaClient();

export async function resetDatabase() {
  await prisma.inventory.deleteMany();
  await prisma.timer.deleteMany();
  await prisma.pokemon.deleteMany();
  await prisma.user.deleteMany();
  await seedTestData();
}

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});
