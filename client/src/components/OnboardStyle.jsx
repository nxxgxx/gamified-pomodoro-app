import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPostWithAuth } from "../security/fetchWithAuth";
import SpriteSelectorGroup from "./SpriteSelectorGroup";

const styles = ["pixel-dark", "retro-light", "neon", "pastel"];

export default function OnboardIntro() {
  const [selectedTrainerId, setSelectedTrainerId] = useState(null)
  const navigate = useNavigate();

  const handleNext = async () => {
    if (!selectedTrainerId) {
      console.log("Didn't select style"); 
      return;
    }

    const idx = selectedTrainerId - 1; // change to 0-based index

    if (idx < 0 || idx > 3) {
      console.error("Invalid trainer id:", idx);
      return;
    }
    
    const res = await fetchPostWithAuth(`${process.env.REACT_APP_API_URL}/onboarding/style`, {"style": styles[idx]})
 
    if (!res.success){
      console.error("Something went wrong selecting the style:", res.error)
      return;
    }

    navigate("/onboard/starter")
  }

  return (
    <div className="pad-y-80 flex-center radial  white-100-text">
      <div className="flex-column width-360px gap-40">
        <h3 className="text-center">Choose your style</h3>
        <SpriteSelectorGroup showTrainer selectedId={selectedTrainerId} setSelectedId={setSelectedTrainerId} />
        <p>TIP: You can view your style anytime from your trainer profile.</p>
        {/* button next */}
        <button
          className="btn-filled cyan-800"
          onClick={handleNext}
        >
          That's Me →
        </button>
      </div>
    </div>
  );
}
