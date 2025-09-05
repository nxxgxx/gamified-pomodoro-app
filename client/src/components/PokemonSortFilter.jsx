import { useState } from "react";
import TogglePill from "./TogglePill";

export default function PokemonSortFilter() {
  const [sortStates, setSortStates] = useState({
    id: 0,
    date: 0,
    level: 0,
    name: 0,
  });

  const handleSortClick = (key) => {
    // only one can be active at a time
    setSortStates((prev) => {
      const newState = (prev[key] + 1) % 3;
      return {
        id: key === "id" ? newState : 0,
        date: key === "date" ? newState : 0,
        level: key === "level" ? newState : 0,
        name: key === "name" ? newState : 0,
      };
    });
  };

  return (
    <div className="flex-row gap-12">
      <TogglePill
        hasIcon={true}
        color={"white-100"}
        name="ID"
        currentState={sortStates.id}
        onClick={() => handleSortClick("id")}
      />
      <TogglePill
        hasIcon={true}
        color={"white-100"}
        name="Date"
        currentState={sortStates.date}
        onClick={() => handleSortClick("date")}
      />
      <TogglePill
        hasIcon={true}
        color={"white-100"}
        name="Level"
        currentState={sortStates.level}
        onClick={() => handleSortClick("level")}
      />
      <TogglePill
        hasIcon={true}
        color={"white-100"}
        name="Name"
        currentState={sortStates.name}
        onClick={() => handleSortClick("name")}
      />
    </div>
  );
}
