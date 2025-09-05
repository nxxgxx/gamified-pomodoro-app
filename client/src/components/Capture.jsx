/*The Capture component is the portion that handles the user attempting to capture a new pokemon. It will trigger a wild encounter and add a pokemon
from primary database into the user's inventory. Currently, it will add the pokemon in response to a button. 
This will be later adjusted to happen automatically. The Capture component has access to the User's inventory via the Inventory Context.*/

import { useAuthUser } from "../security/AuthContext";
import { useInventory } from "../context/InventoryContext";
import { useState } from "react";
import { fetchPostWithAuth } from "../security/fetchWithAuth";

import pokeballImg from "../assets/visuals/pokedoro_img_pokeball.svg";

export default function Capture({ pokemonTheme }) {
  const { user } = useAuthUser();
  const { addToInventory, fetchInventory } = useInventory();
  const [message, setMessage] = useState("");

  if (!pokemonTheme) return null;

  const handleCapture = async () => {
    try {
      const data = await fetchPostWithAuth(
        `${process.env.REACT_APP_API_URL}/capture`
      );

      if (data?.pokemon) {
        await fetchInventory();
      }
      setMessage("You captured a Pokémon!");
    } catch (err) {
      console.error("Capture failed:", err);
      setMessage("Capture failed.");
    }
  };

  return (
    <div
      className={`white-100-text white ${pokemonTheme.bg} ${pokemonTheme.accent} capture width-100 height-100 flex-column align-center gap-8 pad-x-20 pad-y-20`}
    >
      <img
        onClick={handleCapture}
        src={pokeballImg}
        alt=""
        className="pokeball pixel-img clickable"
      />
      <p className=" text-shadow">{message}</p>
    </div>
  );
}
