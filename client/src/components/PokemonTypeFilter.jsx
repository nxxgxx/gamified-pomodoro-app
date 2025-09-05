import { useState } from "react";
import TogglePill from "./TogglePill";

const typeFilters = [
  { name: "normal", color: "white-400" },
  { name: "fire", color: "pink-700" },
  { name: "water", color: "cyan-700" },
  { name: "electric", color: "orange-300" },
  { name: "grass", color: "yellow-green-600" },
  { name: "ice", color: "cyan-300" },
  { name: "fighting", color: "red-600" },
  { name: "poison", color: "violet-600" },
  { name: "ground", color: "red-500" },
  { name: "flying", color: "blue-500" },
  { name: "psychic", color: "violet-500" },
  { name: "bug", color: "yellow-600" },
  { name: "rock", color: "orange-400" },
  { name: "ghost", color: "blue-600" },
  { name: "dragon", color: "periwinkle-600" },
  { name: "dark", color: "magenta-600" },
  { name: "steel", color: "white-300" },
  { name: "fairy", color: "magenta-300" },
];

export default function PokemonSortFilter() {
  const initialStates = typeFilters.reduce((acc, type) => {
    acc[type.name] = 0;
    return acc;
  }, {});

  const [sortStates, setSortStates] = useState(initialStates);

  const handleSortClick = (key) => {
    setSortStates((prev) => ({
      ...prev,
      [key]: (prev[key] + 1) % 2,
    }));
  };

  return (
    <div className="">
      <div className="flex flex-wrap gap-12 ">
        {typeFilters.map((type) => (
          <TogglePill
            key={type.name}
            hasIcon={false}
            color={type.color}
            name={type.name}
            currentState={sortStates[type.name]}
            onClick={() => handleSortClick(type.name)}
          />
        ))}
      </div>
    </div>
  );
}
