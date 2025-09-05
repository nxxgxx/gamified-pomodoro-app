import squirtleSprite from "../assets/visuals/pokedoro_sprite_pokemon_squirtle.png";
import PokemonIconType from "./PokemonIconType";

export default function PokemonPopup({ pokemon, onClose }) {
  if (!pokemon) return null;

  const {
    sprite,
    pokemonName,
    id,
    rarity,
    type1,
    type2,
    level,
    description,
    canEvolve,
    isTrainingBuddy,
  } = pokemon;

  //   const sprite = squirtleSprite;
  //   const pokemonName = "Squirtle";
  //   const id = 7;
  //   const rarity = "rare";
  //   const type1 = "water";
  //   const type2 = "null";
  //   const level = 13;
  //   const description =
  //     "After birth, its back swells and hardens into a shell. Powerfully sprays foam from its mouth.";
  //   const canEvolve = true;
  //   const isTrainingBuddy = false;

  return (
    <div className="popup-overlay " onClick={onClose}>
      <div
        className="popup-content black-800 radius-8 pad-x-40 pad-y-40 flex-row gap-16"
        onClick={(e) => e.stopPropagation()}
      >
        {/* pokemon sprite */}
        <img src={sprite} alt="" className="profile-img" />
        {/* pokemon all information */}
        <div className="flex-column gap-20">
          {/* name/id/type/description */}
          <div className="flex-column icon-small">
            <h4>{pokemonName}</h4>
            <p className="xs">#{id}</p>
            <div className="flex-row pad-y-4 gap-4">
              <PokemonIconType isRarity={true} name={rarity} />
              <PokemonIconType isType={true} name={type1} />
              <PokemonIconType isType={true} name={type2} />
            </div>

            <p className="xs">Lvl. {level}</p>
            <p className="xs">{description}</p>
            <p className="xs">Can evolve: {canEvolve ? "YES" : "NO"}</p>
          </div>

          {/* Buttons */}
          {isTrainingBuddy ? (
            <button className="btn-outline xs">Current training buddy</button>
          ) : (
            // TODO
            // set this pokemon to training buddy in the inventory when pressed
            <button className="btn-filled xs green-700">
              Set as training buddy
            </button>
          )}
          {/* TODO 
            Make it so this will delete a pokemon on click
            This will close the popup */}
          <button className="btn-filled xs pink-700">Release Pokemon</button>
        </div>
      </div>
    </div>
  );
}
