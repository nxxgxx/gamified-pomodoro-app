let newPokemon; // global pokemon

function getPokemonInfoFetch(input) {
  // fetch url
  const pokeUrl = `https://pokeapi.co/api/v2/pokemon/${input}/`;

  fetch(pokeUrl)
    // return parsed json
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Pokemon not found: ${res.status}`);
      }
      return res.json();
    })

    //// set up the basic pokemon data
    .then((data) => {
      console.log(data);

      // grab the pokemon data from the api
      let pokemon = {
        //// basic data ////
        id: data.id, // pokemon id
        name: data.name, // pokemon name
        type: data.types.map((t) => t.type.name), // pokemon type (water, fire, rock, grass, etc.)
        cries: [data.cries?.latest || null], // battle cry of the pokemon
        color: [], // the color of the pokemon... updated from /pokemon-species

        //// catch data ////
        // will be updated from /pokemon-species
        isLegendary: false,
        isMythical: false,
        catchRate: null,

        //// images ////
        imgDefaultFront: data.sprites.front_default, // pokemon default images and sprites
        imgDefaultBack: data.sprites.back_default,
        imgShinyFront: data.sprites.front_shiny, // pokemon shiny variation images and sprites
        imgShinyBack: data.sprites.back_shiny,

        //// evolutions ////
        evolutionNamesAll: [], // names of the evolutions
        evolutionIdsAll: [], // ids of the evolutions
        evolutionImagesAll: [], // front sprites of the evolutions
        evolutionShinyImagesAll: [], // front sprites shiny variations of evolutions

        //// leveling up ////
        evolveTrigger: [],
        evolveMinLevel: [],

        //// raw pokemon data
        raw: {
          pokemon: data, // save raw pokemon data
        },
      };

      newPokemon = pokemon; // set pokemon to global variable

      return fetch(data.species.url); // get the species url
    })

    //// get the species data from above
    .then((res) => res.json())
    .then((speciesData) => {
      newPokemon.isLegendary = speciesData.is_legendary;
      newPokemon.isMythical = speciesData.is_mythical;
      newPokemon.catchRate = speciesData.capture_rate;
      newPokemon.color = [speciesData.color.name];

      newPokemon.raw.species = speciesData; // add raw data to newPokemon

      console.log("Pokemon data:", newPokemon);
    })

    //// get the pokemon evolution chain
    .then(() => getPokemonEvolutionChain(input))
    .then(() => newPokemon)

    //// log pokemon data
    .then(() => {
      console.log("Pokemon data:", newPokemon);
      return newPokemon;
    })

    //// catch any errors
    .catch((err) => {
      console.error("Failed to fetch Pokémon data:", err);
    });
}

async function getPokemonEvolutionChain(input) {
  const evolutionNamesAll = []; // names of the evolutions
  const evolutionIdsAll = []; // ids of the evolutions
  const evolutionImagesAll = []; // front sprites of the evolutions
  const evolutionShinyImagesAll = []; // front sprites shiny variations of evolutions
  const evolveTrigger = [];
  const evolveMinLevel = [];

  try {
    // get pokemon data
    const baseRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    const baseData = await baseRes.json();

    // get species data
    const speciesRes = await fetch(baseData.species.url);
    const speciesData = await speciesRes.json();

    // get evolution chain data
    const evoRes = await fetch(speciesData.evolution_chain.url);
    const evoData = await evoRes.json();

    newPokemon.raw.evolutionChain = evoData;

    // traverse the evolution chain
    await traverseEvolutionChain(
      evoData.chain,
      evolutionNamesAll,
      evolutionIdsAll,
      evolutionImagesAll,
      evolutionShinyImagesAll,
      evolveTrigger,
      evolveMinLevel
    );

    // store in newPokemon
    newPokemon.evolutionNamesAll = evolutionNamesAll;
    newPokemon.evolutionIdsAll = evolutionIdsAll;
    newPokemon.evolutionImagesAll = evolutionImagesAll;
    newPokemon.evolutionShinyImagesAll = evolutionShinyImagesAll;
    newPokemon.evolveTrigger = evolveTrigger;
    newPokemon.evolveMinLevel = evolveMinLevel;
  } catch (err) {
    console.error("Failed to load evolution chain:", err);
  }
}

// walk through the evolution chain
async function traverseEvolutionChain(
  node,
  namesArr,
  idsArr,
  imgsArr,
  shinyImgsArr,
  triggerArr,
  minLevelArr
) {
  if (!node) return;

  // save evolve pokemon name
  const name = node.species.name;
  namesArr.push(name);

  // fetch data for the evolution stage
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const data = await res.json();

  // get sprite and id
  idsArr.push(data.id);
  imgsArr.push(data.sprites.front_default);
  shinyImgsArr.push(data.sprites.front_shiny);

  if (node.evolves_to.length === 0) {
    triggerArr.push("final-evolution");
    minLevelArr.push(null);
    return;
  }

  // handle next evolutions
  for (const next of node.evolves_to) {
    const evoDetails = next.evolution_details[0] || {};
    const trigger = evoDetails.trigger?.name || "unknown";
    const minLevel = evoDetails.min_level
      ? evoDetails.min_level
      : namesArr.length * 16;

    triggerArr.push(trigger);
    minLevelArr.push(minLevel);

    // search next evolutions
    await traverseEvolutionChain(
      next,
      namesArr,
      idsArr,
      imgsArr,
      shinyImgsArr,
      triggerArr,
      minLevelArr
    );
  }
}

export async function getPokemonColorById(pokedexId) {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokedexId}`
  );
  if (!res.ok) throw new Error("Failed to fetch Pokémon species data");

  const data = await res.json();
  console.log("Fetched Pokémon color:" + data.color);
  return data.color?.name || "default"; // fallback to "default"
}
