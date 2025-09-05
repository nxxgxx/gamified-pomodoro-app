/*This is currently the User's inventory of Pokemon. It displays all pokemon that belong to a user. Later, the User will choose
one Pokemon to train on their next study session, and they may change out the current Pokemon by selecting from their inventory.*/

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useInventory } from "../context/InventoryContext";

import chevronIcon from "../assets/visuals/pokedoro_icon_angle_down.svg";

export default function Pokemon({ pokemonTheme }) {
  const { inventory, selectedInventoryId, selectPokemon, loading } =
    useInventory();
  const [isSelectingPokemon, setIsSelectingPokemon] = useState(false);
  const navigate = useNavigate();
  const selected = inventory.find(
    (p) => p.inventory_id === selectedInventoryId
  );

  // When starting, only 1 pokemon is in the inventory but has never been chosen.
  // Automatically choose it with useEffect
  useEffect(() => {
    // Only run once loading is complete.
    if (!loading && inventory.length === 1 && !selectedInventoryId) {
      // If there's one item and nothing is selected, auto-select it.
      handleSelect(inventory[0].inventory_id);
    }
  }, [loading, inventory, selectedInventoryId]);

  if (!pokemonTheme) return null;

  const handleSelect = async (inventoryId) => {
    try {
      await selectPokemon(inventoryId);
      setIsSelectingPokemon(false); // Switch back to view mode
    } catch (err) {
      console.error("Failed to select Pokemon:", err);
    }
  };

  if (loading) {
    return <p>Loading your inventory...</p>;
  }

  // Empty inventory

  if (inventory.length === 0) {
    return <p>No Pokémon yet. Try capturing one!</p>;
  }

  return (
    <div
      className={`${pokemonTheme.text} ${pokemonTheme.bg} ${pokemonTheme.accent} width-100 height-100  flex-column gap-32 pad-x-20 pad-y-20`}
    >
      {isSelectingPokemon ? (
        <div className="flex-column gap-8">
          {/* back button */}
          <div className="white-100-text white">
            <button
              onClick={() => setIsSelectingPokemon(false)}
              className="flex-row gap-8 icon-btn"
            >
              <img src={chevronIcon} alt="" className="flip-left" />
              Back
            </button>
          </div>
          {/* pokemon inventory */}
          <div
            className={`${pokemonTheme.accent} select-pokemon-inventory white-100 pad-x-16 pad-y-16 flex flex-wrap height-280px`}
          >
            {inventory.map((poke) => {
              if (!poke.pokemon) {
                console.log("Issue with loading");
                return null;
              }
              return (
                <button onClick={() => handleSelect(poke.inventory_id)}>
                  <img
                    src={poke.pokemon.image_url}
                    alt=""
                    className="width-height-48 btn-icon pixel-img"
                  />
                </button>
              );
            })}
          </div>
          <p className="xs text-center">
            Sort through Pokemon{" "}
            <a
              // href=""
              className="blue-700-text"
              // readd later
              // onClick={() => navigate("/app/pokemon")}
            >
              here
            </a>
          </p>

          {/* TODO
            when pokemon is selected, make sure the theme also changes */}
        </div>
      ) : selected ? (
        <div className="flex-column gap-8 justify-center align-center height-100">
          <h3>Training Pokemon</h3>
          <h5 className="uppercase">{selected.pokemon.name}</h5>
          <h6>xp {selected.experience}</h6>
          <img
            src={selected.pokemon.image_url}
            alt=""
            className="width-height-96 btn-icon pixel-img"
          />
          <div className="white-100-text white">
            <button
              className={`${pokemonTheme.header} btn-filled`}
              onClick={() => setIsSelectingPokemon(true)}
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-column gap-8 justify-center align-center height-100">
          <p className="text-center">No Pokemon selected. Please choose one:</p>
          <div className="white-100-text white">
            <button
              className={`${pokemonTheme.header} btn-filled`}
              onClick={() => setIsSelectingPokemon(true)}
            >
              Choose
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
