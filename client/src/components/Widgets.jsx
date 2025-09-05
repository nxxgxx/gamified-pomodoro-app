/*The Widgets component organizes the 4 primary widgets into a grid-like display. It contains the Study Stage widget up top, a central row with the 
Inventory, Timer, Music, and Capture components, and a bottom section with the Status Component.*/
import Pokemon from "./Pokemon";
import Pokedoro from "./Pokedoro";
import Music from "./Music";
import Capture from "./Capture";
import Status from "./Status";
import StudyStage from "./StudyStage";
import DashboardWidgetFrame from "./DashboardWidgetFrame";

import { useEffect, useState } from "react";
import { useInventory } from "../context/InventoryContext";
import { getPokemonColorById } from "../api/pokeapi.js";

export default function Widgets() {
  const { inventory, selectedInventoryId, selectPokemon, loading } =
    useInventory();
  const selected = inventory.find(
    (p) => p.inventory_id === selectedInventoryId
  );
  const [currentColor, setCurrentColor] = useState("default");

  useEffect(() => {
    console.log("finding pokemon color...");

    if (!selected?.pokemon?.pokedex_id) return;

    const fetchColor = async () => {
      try {
        const color = await getPokemonColorById(selected.pokemon.pokedex_id);
        console.log("Fetched Pokémon color:", color);
        setCurrentColor(color.toLowerCase());
      } catch (err) {
        console.error("Failed to fetch Pokémon color:", err);
        setCurrentColor("default");
      }
    };

    fetchColor();
  }, [selected]);

  return (
    <>
      <div className="pad-y-80 flex-center radial">
        <div className=" max-width-1200 flex-column gap-40">
          <StudyStage />

          <div className="max-width-1200 flex flex-wrap gap-40 flex-none justify-center">
            <DashboardWidgetFrame
              widgetName={"training"}
              pokemonColor={currentColor}
            />
            <DashboardWidgetFrame
              widgetName={"timer"}
              pokemonColor={currentColor}
            />
            <div className="flex-column flex-wrap space-between gap-40 flex-none">
              <DashboardWidgetFrame
                widgetName={"music"}
                pokemonColor={currentColor}
              />
              <DashboardWidgetFrame
                widgetName={"capture"}
                pokemonColor={currentColor}
              />
            </div>

            <DashboardWidgetFrame
              widgetName={"status"}
              pokemonColor={currentColor}
            />
          </div>
        </div>
      </div>
    </>
  );
}
