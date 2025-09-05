import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPostWithAuth } from "../security/fetchWithAuth"
import { useInventory } from "../context/InventoryContext";
import SpriteSelectorGroup from "./SpriteSelectorGroup";

import professorSprite from "../assets/visuals/pokemon_sprite_professor_oak.png";

export default function OnboardIntro() {
  const [selectedPokemonId, setSelectedPokemonId] = useState(null)
  const navigate = useNavigate();
  const { fetchInventory } = useInventory(); 

  const handleStart = async() => {
    if (!selectedPokemonId) {
      console.log("Pressed click without selecting pokemon");
      return;
    }

    try {
      // Add the chosen pokemon to the user's inventory
      const data = await fetchPostWithAuth(`${process.env.REACT_APP_API_URL}/capture/${selectedPokemonId}`);

      if (data.error) {
        console.error("Failed to add starter pokemon:", data.error || "Unknown error when adding starter pokemon");
        return;
      }
      // Refresh the inventory before navigating to next page
      await fetchInventory();

      //@TODO: Post request to mark user as onboarded
      const onboarded = await fetchPostWithAuth(`${process.env.REACT_APP_API_URL}/onboarding/complete`)

      if (!onboarded.success){
        console.error("Unable to mark onboarding as complete:", onboarded.error);
      }

      navigate("/app")
    } catch (err) {
      console.error("Unknown error when adding Starter:", err);
    }
  }

  return (
    <div className="pad-y-80 flex-center radial  white-100-text">
      <div className="flex-column width-360px gap-40">
        <h3 className="text-center">Choose your starter</h3>
        <div className="flex-row gap-12 space-between">
          <img src={professorSprite} alt="" />
          <p>
            Take a POKEMON with you to start! Don’t worry, the more you focus,
            the more you’ll collect.
          </p>
        </div>
        <SpriteSelectorGroup showPokemon selectedId={selectedPokemonId} setSelectedId={setSelectedPokemonId}/>
        {/* button next */}
        <button
          className="btn-filled cyan-800"
          onClick={handleStart} 
        >
          Start Journey →
        </button>
      </div>
    </div>
  );
}
