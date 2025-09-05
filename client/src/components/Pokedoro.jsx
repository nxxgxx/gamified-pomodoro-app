/* The Pokedoro component is a wrapper for the timer and settings
components. It will display one or the other, and hold the state that 
contains the user selected (or default) timer settings */

import { useState } from "react";
import PokedoroTimerView from "./PokedoroTimerView";
import PokedoroSettingsView from "./PokedoroSettingsView";
import { useInventory } from "../context/InventoryContext";
import {
  DEFAULT_FOCUS_SEC,
  DEFAULT_BREAK_SEC,
  DEFAULT_REST_SEC,
} from "../constants";

export default function Pokedoro({ mode, setMode, pokemonTheme }) {
  const [view, setView] = useState("TIMER");
  const [focusDuration, setFocusDuration] = useState(DEFAULT_FOCUS_SEC);
  const [breakDuration, setBreakDuration] = useState(DEFAULT_BREAK_SEC);
  const [restDuration, setRestDuration] = useState(DEFAULT_REST_SEC);

  const { inventory, selectedInventoryId, fetchInventory } = useInventory();
  const selected = inventory.find((p) => p.inventory_id === selectedInventoryId);

  if (!pokemonTheme) return null;

  return (
    <div
      className={`${pokemonTheme.text} ${pokemonTheme.bg} ${pokemonTheme.accent} width-100 height-100 justify-center flex-column gap-20 pad-x-20 pad-y-20`}
    >
      {view === "TIMER" ? (
        <PokedoroTimerView
          focusDuration={focusDuration}
          breakDuration={breakDuration}
          restDuration={restDuration}
          setView={setView}
          pokemonTheme={pokemonTheme}
          selected={selected}
          fetchSelectedPokemon={fetchInventory} // renamed this way for TimerView continuity
        />
      ) : (
        <PokedoroSettingsView
          focusDuration={focusDuration}
          breakDuration={breakDuration}
          restDuration={restDuration}
          setFocusDuration={setFocusDuration}
          setBreakDuration={setBreakDuration}
          setRestDuration={setRestDuration}
          setView={setView}
        />
      )}
    </div>
  );
}
