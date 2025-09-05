const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const fs = require('fs');
const prisma = new PrismaClient();

function getRarity(speciesData) {
  const legendaryNames = ["mewtwo", "mew", "articuno", "zapdos", "moltres"];
  if (legendaryNames.includes(speciesData.name)) return "LEGENDARY";

  const id = speciesData.id;
  if (id <= 20) return "COMMON";
  if (id <= 100) return "UNCOMMON";
  return "RARE";
}

async function clearDatabase() {
  console.log("Clearing existing data...");
  await prisma.$transaction([
    prisma.inventory.deleteMany(),
    prisma.user.deleteMany(),
    prisma.pokemon.deleteMany(),
  ]);
  console.log("Database cleared.");
}

async function fetchAndSeedPokemon() {
  const gen1Pokemon = [];

  console.log("Fetching Gen 1 Pokémon...");

  for (let id = 1; id <= 151; id++) {
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();

      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();
      const rarity = getRarity(speciesData);

      const pokemon = {
        pokedex_id: data.id,
        name: data.name,
        nickname: data.name,
        rarity,
        image_url: data.sprites.front_default,
      };

      gen1Pokemon.push(pokemon);
      console.log(`Fetched #${id} - ${pokemon.name}`);
    } catch (err) {
      console.error(`Error fetching Pokémon #${id}:`, err.message);
    }
  }

  await prisma.pokemon.createMany({
    data: gen1Pokemon,
    skipDuplicates: true,
  });

  console.log("Seeded Gen 1 Pokémon.");
}

async function applyEvolutionMappings() {
  console.log("Applying evolution mappings...");

  let evolutionData;
  try {
    evolutionData = JSON.parse(fs.readFileSync('./evolutionMappings.json', 'utf8'));
  } catch (err) {
    console.error("Could not read evolutionMappings.json:", err.message);
    return;
  }

  for (const [name, evo] of Object.entries(evolutionData)) {
    if (!name || !evo?.next || !evo?.level) continue;
  
    const from = await prisma.pokemon.findUnique({ where: { name } });
    const to = await prisma.pokemon.findUnique({ where: { name: evo.next } });
  
    if (!from || !to) {
      console.warn(`Skipping evolution: ${name} → ${evo.next}`);
      continue;
    }
  
    await prisma.pokemon.update({
      where: { pokemon_id: from.pokemon_id },
      data: {
        next_evolution_id: to.pokemon_id,
        evolve_level: evo.level,
      },
    });
  
    console.log(`${from.name} evolves into ${to.name} at level ${evo.level}`);
  }  

  console.log("Evolution chains applied.");
}

async function main() {
  await clearDatabase();
  await fetchAndSeedPokemon();
  await applyEvolutionMappings();
}

main()
  .catch((e) => {
    console.error("Seed script failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
