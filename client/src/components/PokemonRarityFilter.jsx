import { useState } from "react";
import TogglePill from "./TogglePill";

export default function PokemonSortFilter() {
  const [sortStates, setSortStates] = useState({
    common: 0,
    uncommon: 0,
    rare: 0,
    legendary: 0,
  });

  const handleSortClick = (key) => {
    // any can be active
    setSortStates((prevStates) => ({
      ...prevStates,
      [key]: (prevStates[key] + 1) % 2,
    }));
  };

  return (
    <div className="flex-row gap-12">
      <TogglePill
        hasIcon={false}
        color={"white-100"}
        name="common"
        currentState={sortStates.common}
        onClick={() => handleSortClick("common")}
      />
      <TogglePill
        hasIcon={false}
        color={"gradient-green"}
        name="uncommon"
        currentState={sortStates.uncommon}
        onClick={() => handleSortClick("uncommon")}
      />
      <TogglePill
        hasIcon={false}
        color={"gradient-blue"}
        name="rare"
        currentState={sortStates.rare}
        onClick={() => handleSortClick("rare")}
      />
      <TogglePill
        hasIcon={false}
        color={"gradient-yellow"}
        name="legendary"
        currentState={sortStates.legendary}
        onClick={() => handleSortClick("legendary")}
      />
    </div>
  );
}
