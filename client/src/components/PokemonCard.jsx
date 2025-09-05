import { useState } from "react";
import PokemonPopup from "./PokemonPopup";

import squirtleSprite from "../assets/visuals/pokedoro_sprite_pokemon_squirtle.png";
import PokemonIconType from "./PokemonIconType";

export default function PokemonCard({ pokemonId, pokemonLevel, isBuddy }) {
  const [showPopup, setShowPopup] = useState(false);
  // TODO
  // need to make this dynamic to take a pokemon and show their information

  const sprite = squirtleSprite;
  const pokemonName = "Squirtle";
  const level = pokemonLevel ?? 1;
  const rarity = "rare";
  const type1 = "water";
  const type2 = "null";
  const isTrainingBuddy = isBuddy ? true : false;

  const pokemonData = {
    sprite,
    pokemonName,
    id: pokemonId,
    level,
    rarity,
    type1,
    type2,
    description:
      "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.",
    canEvolve: true,
    isTrainingBuddy,
  };

  return (
    <>
      {/* Pokémon card */}
      <div
        className={`black-transparent-900 clickable width-200px align-center flex-row gap-10 pad-x-4 pad-y-4 radius-8 ${
          isTrainingBuddy ? "gradient-rainbow-100 black-900-text" : ""
        }`}
        onClick={() => setShowPopup(true)}
      >
        <img
          src={sprite}
          className="width-height-60 pixel-img"
          alt={`${pokemonName} name at level ${level}`}
        />
        <div className="flex-column">
          <p>{pokemonName}</p>
          <p className="xs">Lvl. {level}</p>
          <div className="icon-small">
            <div className="flex-row gap-4 pad-y-4">
              <PokemonIconType isRarity name={rarity} />
              <PokemonIconType isType name={type1} />
              <PokemonIconType isType name={type2} />
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <PokemonPopup
          pokemon={pokemonData}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
