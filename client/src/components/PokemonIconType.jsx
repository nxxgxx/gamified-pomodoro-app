import commonIcon from "../assets/visuals/pokedoro_icon_circle.svg";
import uncommonIcon from "../assets/visuals/pokedoro_icon_star_1.svg";
import rareIcon from "../assets/visuals/pokedoro_icon_star_2.svg";
import legendaryIcon from "../assets/visuals/pokedoro_icon_sparkle.svg";

import bugIcon from "../assets/visuals/pokedoro_type_icon_bug.png";
import darkIcon from "../assets/visuals/pokedoro_type_icon_dark.png";
import dragonIcon from "../assets/visuals/pokedoro_type_icon_dragon.png";
import electricIcon from "../assets/visuals/pokedoro_type_icon_electric.png";
import fairyIcon from "../assets/visuals/pokedoro_type_icon_fairy.png";
import fightingIcon from "../assets/visuals/pokedoro_type_icon_fighting.png";
import fireIcon from "../assets/visuals/pokedoro_type_icon_fire.png";
import flyingIcon from "../assets/visuals/pokedoro_type_icon_flying.png";
import ghostIcon from "../assets/visuals/pokedoro_type_icon_ghost.png";
import grassIcon from "../assets/visuals/pokedoro_type_icon_grass.png";
import groundIcon from "../assets/visuals/pokedoro_type_icon_ground.png";
import iceIcon from "../assets/visuals/pokedoro_type_icon_ice.png";
import normalIcon from "../assets/visuals/pokedoro_type_icon_normal.png";
import poisonIcon from "../assets/visuals/pokedoro_type_icon_poison.png";
import psychicIcon from "../assets/visuals/pokedoro_type_icon_psychic.png";
import rockIcon from "../assets/visuals/pokedoro_type_icon_rock.png";
import steelIcon from "../assets/visuals/pokedoro_type_icon_steel.png";
import waterIcon from "../assets/visuals/pokedoro_type_icon_water.png";

const rarityIcon = [
  { id: 1, name: "common", colorClass: "white-100", src: commonIcon },
  { id: 2, name: "uncommon", colorClass: "gradient-green", src: uncommonIcon },
  { id: 3, name: "rare", colorClass: "gradient-blue", src: rareIcon },
  {
    id: 4,
    name: "legendary",
    colorClass: "gradient-yellow",
    src: legendaryIcon,
  },
];

const typeIcon = [
  { id: 1, name: "bug", src: bugIcon },
  { id: 2, name: "dark", src: darkIcon },
  { id: 3, name: "dragon", src: dragonIcon },
  { id: 4, name: "electric", src: electricIcon },
  { id: 5, name: "fairy", src: fairyIcon },
  { id: 6, name: "fighting", src: fightingIcon },
  { id: 7, name: "fire", src: fireIcon },
  { id: 8, name: "flying", src: flyingIcon },
  { id: 9, name: "ghost", src: ghostIcon },
  { id: 10, name: "grass", src: grassIcon },
  { id: 11, name: "ground", src: groundIcon },
  { id: 12, name: "ice", src: iceIcon },
  { id: 13, name: "normal", src: normalIcon },
  { id: 14, name: "poison", src: poisonIcon },
  { id: 15, name: "psychic", src: psychicIcon },
  { id: 16, name: "rock", src: rockIcon },
  { id: 17, name: "steel", src: steelIcon },
  { id: 18, name: "water", src: waterIcon },
];

export default function PokemonIconType({ isRarity, isType, name }) {
  let icon = null;

  if (isRarity) {
    icon = rarityIcon.find(
      (item) => item.name.toLowerCase() === name?.toLowerCase()
    );
  } else if (isType) {
    icon = typeIcon.find(
      (item) => item.name.toLowerCase() === name?.toLowerCase()
    );
  }

  if (!icon) return null; // avoid crash if name doesn't match

  return (
    <div className="type-icon-wrapper">
      {isRarity && (
        <div
          className={`${icon.colorClass} radius-4 pad-x-2 pad-y-2 type-icon`}
        >
          <img src={icon.src} alt={`${icon.name} rarity`} className="" />
        </div>
      )}
      {isType && (
        <img
          src={icon.src}
          alt={`${icon.name} type`}
          className="pixel-img  type-icon radius-4"
        />
      )}
    </div>
  );
}
