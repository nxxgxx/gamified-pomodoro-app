import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchGetWithAuth, fetchDeleteWithAuth } from "../security/fetchWithAuth";

import spritePi from "../assets/visuals/pokedoro_sprite_trainer_pi.png";
import spriteJogger from "../assets/visuals/pokedoro_sprite_trainer_jogger.png";
import spriteLass from "../assets/visuals/pokedoro_sprite_trainer_lass.png";
import spriteLady from "../assets/visuals/pokedoro_sprite_trainer_lady.png";

const spriteTrainer = {
  "pixel-dark": spritePi,
  "retro-light": spriteJogger,
  "neon": spriteLass,
  "pastel": spriteLady
}

export default function PageProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  const navigate = useNavigate();
  
  useEffect(() => {
    async function getProfile() {
      try {
        const user_data = await fetchGetWithAuth(`${process.env.REACT_APP_API_URL}/app/profile`);
        setProfile(user_data.data);
        const selected = await fetchGetWithAuth(`${process.env.REACT_APP_API_URL}/inventory/selected`);
        setSelectedPokemon(selected);
      } catch (err) {
        console.error("Error when trying to gather user profile data:", err);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, []);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );

    if (!confirmed) return; // Cancel

    const deleted = await fetchDeleteWithAuth(`${process.env.REACT_APP_API_URL}/app/profile`);
      
    if (!deleted.success) {
      console.error("Deletion failed", deleted.error);
      alert(deleted.error || "An error occurred while trying to delete the account.");
      return;
    }
    
    navigate("/app/account-deleted");
  }

  if (loading) return (<div>Trainer profile loading. . .</div>); 

  //   TODO
  // These values should all be dynamic based on the current user
  // Make sure there are default values
  // // in case there is issue grabbing from the user
  const inventory = profile?.inventories || [];
  const timers = profile?.timers || [];
  const raw_start_date = profile?.created_at || undefined

  const id = profile?.user_id || "Unknown";
  const username = profile?.username || "Unknown";
  const numOfPokemon = inventory.length || "Unknown";

  // Reduce the inventories total experience into a single number
  const score = inventory && inventory.length > 0 
  ? inventory.reduce((sum, pokemon) => sum + (pokemon.experience || 0), 0)
  : 0;
  
  // Sum the total amount of time completed
  const time = timers && timers.length > 0
  ? timers.reduce((sum, timer) => sum + (timer.duration || 0), 0)
  : 0;

  // Format the start date to Mmm dd, yyyy
  const started = raw_start_date 
  ? new Date(raw_start_date).toLocaleDateString("en-US", {
    month: "short", 
    day: "2-digit", 
    year: "numeric"
  }) 
  : "Unknown";


  const buddy = selectedPokemon?.nickname || selectedPokemon?.pokemon?.name || "None selected";
  
  const sprite = spriteTrainer[profile.current_style]; 



  return (
    <div className="pad-y-80 flex-center radial  white-100-text">
      {/* MAIN SECTION */}
      <div className="flex-column gap-40 width-360px">
        {/* SECTION */}
        {/* trainer card */}
        <div className="black-transparent-900 flex-column width-360px gap-12 pad-x-8 pad-y-8">
          <h3>Trainer Card</h3>
          {/* info and profile sprite */}
          <div className="flex-row">
            {/* id / username / pokedex / score */}
            <div className="flex-column gap-12">
              {/* id */}
              <div className="white-transparent-100 flex-row radius-8 pad-x-4 space-between">
                <h6>Id: </h6>
                <h6>{id}</h6>
              </div>
              {/* username */}
              <div className="white-transparent-100 flex-row radius-8 pad-x-4 space-between">
                <h6>Username: </h6>
                <h6>{username}</h6>
              </div>
              {/* pokedex */}
              <div className="white-transparent-100 flex-row radius-8 pad-x-4 space-between">
                <h6>Pokedex: </h6>
                <h6>{numOfPokemon}</h6>
              </div>
              {/* score */}
              <div className="white-transparent-100 flex-row radius-8 pad-x-4 space-between">
                <h6>Score: </h6>
                <h6>{score}</h6>
              </div>
            </div>
            {/* sprite */}
            <img src={sprite} alt="" className="pixel-img profile-img" />
          </div>

          {/* time / adventure / buddy */}
          <div className="flex-column gap-12">
            {/* time */}
            <div className="white-transparent-100 flex-row radius-8 pad-x-4 space-between">
              <h6>Time: </h6>
              <h6>{time}</h6>
            </div>
            {/* adventure started */}
            <div className="white-transparent-100 flex-row radius-8 pad-x-4 space-between">
              <h6>Adventure Started: </h6>
              <h6>{started}</h6>
            </div>
            {/* buddy */}
            <div className="white-transparent-100 flex-row radius-8 pad-x-4 space-between">
              <h6>Current Buddy: </h6>
              <h6>{buddy}</h6>
            </div>
          </div>
        </div>
        {/* SECTION */}
        {/* settings */}
        <div className="flex-column gap-20">
          <h3>Settings</h3>
          <div className="flex-column gap-12">
            {/* sound effects */}
            <label className="custom-checkbox light">
              <input type="checkbox" id="toggle-sound-settings" />
              <span className="checkmark"></span>Enable sound effects
            </label>
            {/* timer notifications */}
            <label className="custom-checkbox light">
              <input type="checkbox" id="toggle-timer-notifs" />
              <span className="checkmark"></span>Enable timer notifications
            </label>
          </div>
        </div>

        {/* SECTION */}
        {/* Account Management */}
        <div className="flex-column gap-20">
          <h3>Account</h3>
          <button className="btn-outline" onClick={() => navigate("/")}>
            Log Out
          </button>
          {/* TODO */}
          {/* add DELETE ACCOUNT functionality */}
          {/* TODO */}
          {/* add a window alert to warn the user that they can't get their account back */}
          <button
            className="btn-filled pink-800"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
