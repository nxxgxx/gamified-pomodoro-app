import React from "react";
import SelectableSprite from "./SpriteSelectable";

// trainer sprites
import trainerSprite1 from "../assets/visuals/pokedoro_sprite_trainer_pi.png";
import trainerSprite2 from "../assets/visuals/pokedoro_sprite_trainer_jogger.png";
import trainerSprite3 from "../assets/visuals/pokedoro_sprite_trainer_lass.png";
import trainerSprite4 from "../assets/visuals/pokedoro_sprite_trainer_lady.png";

// pokemon sprites
import pokemonSprite1 from "../assets/visuals/pokedoro_sprite_pokemon_bulbasaur.png";
import pokemonSprite2 from "../assets/visuals/pokedoro_sprite_pokemon_charmander.png";
import pokemonSprite3 from "../assets/visuals/pokedoro_sprite_pokemon_squirtle.png";

const trainerSprites = [
  { id: 1, src: trainerSprite1 },
  { id: 2, src: trainerSprite2 },
  { id: 3, src: trainerSprite3 },
  { id: 4, src: trainerSprite4 },
];

const pokemonSprites = [
  { id: 1, src: pokemonSprite1 },
  { id: 4, src: pokemonSprite2 },
  { id: 7, src: pokemonSprite3 },
];

export default function SpriteSelectorGroup({ showPokemon, showTrainer, selectedId, setSelectedId }) {
  const spriteList = showTrainer
    ? trainerSprites
    : showPokemon
    ? pokemonSprites
    : [];

  return (
    <div className="flex-row space-between">
      {spriteList.map((sprite) => (
        <SelectableSprite
          key={sprite.id}
          imgSrc={sprite.src}
          isSelected={selectedId === sprite.id}
          onClick={() => setSelectedId(sprite.id)}
        />
      ))}
    </div>
  );
}
