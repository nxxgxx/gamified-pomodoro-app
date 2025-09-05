// Evolutions.js
// Node.js script to generate evolution mappings from PokéAPI

import fetch from "node-fetch";
import fs from "fs";

// Get evolution chain URL from a species endpoint
async function getEvolutionChain(speciesUrl) {
  const res = await fetch(speciesUrl);
  const species = await res.json();
  const evoRes = await fetch(species.evolution_chain.url);
  const evoData = await evoRes.json();
  return evoData.chain;
}

// Walks through the chain recursively and builds an array
function walkChain(chain, result = [], level = 0) {
  const name = chain.species.name;
  result.push({ name, level });
  if (chain.evolves_to.length > 0) {
    walkChain(chain.evolves_to[0], result, level + 1);
  }
  return result;
}

// Fetch and construct mapping
async function main() {
  const evolutionMap = {};

  for (let id = 1; id <= 151; id++) {
    const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;

    try {
      const chain = await getEvolutionChain(speciesUrl);
      const stages = walkChain(chain);
      for (let i = 0; i < stages.length - 1; i++) {
        evolutionMap[stages[i].name] = {
          next: stages[i + 1].name,
          level: stages[i + 1].level * 100 // Example evolve level logic
        };
      }
    } catch (err) {
      console.error(`Error with ID ${id}:`, err.message);
    }
  }

  fs.writeFileSync("evolutionMappings.json", JSON.stringify(evolutionMap, null, 2));
  console.log("Evolution data written to evolutionMappings.json");
}

main();
