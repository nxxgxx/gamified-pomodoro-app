/*This is the Music component of the app. It currently is a placeholder and does not have any functionality yet.*/
import { useAuthUser } from "../security/AuthContext";
import { useState } from "react";

import pauseIcon from "../assets/visuals/pokedoro_icon_pause.svg";
import playIcon from "../assets/visuals/pokedoro_icon_play.svg";
import leftIcon from "../assets/visuals/pokedoro_icon_play_left.svg";
import rightIcon from "../assets/visuals/pokedoro_icon_play_right.svg";
import volumeDisableIcon from "../assets/visuals/pokedoro_icon_volume_disable.svg";
import volumeLowIcon from "../assets/visuals/pokedoro_icon_volume_low.svg";
import volumeMediumIcon from "../assets/visuals/pokedoro_icon_volume_medium.svg";
import volumeHighIcon from "../assets/visuals/pokedoro_icon_volume_high.svg";

export default function Music({ pokemonTheme }) {
  const { user } = useAuthUser();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);

  if (!user || !pokemonTheme) return null;

  const togglePlay = () => setIsPlaying((prev) => !prev);

  return (
    <div
      className={`${pokemonTheme.text} ${pokemonTheme.bg} ${pokemonTheme.accent} width-100 height-100 flex-column justify-center pad-x-20 pad-y-20 gap-20`}
    >
      {/* Controls */}
      <div className="flex-row width-100 align-center justify-center gap-0">
        <button className="icon-btn">
          <img src={leftIcon} alt="Previous" className="icon pixel-img" />
        </button>

        <button className="icon-btn" onClick={togglePlay}>
          <img
            src={isPlaying ? pauseIcon : playIcon}
            alt="Play/Pause"
            className="icon pixel-img"
          />
        </button>

        <button className="icon-btn">
          <img src={rightIcon} alt="Next" className="icon pixel-img" />
        </button>

        <button className="icon-btn">
          <img
            src={
              volume === 0
                ? volumeDisableIcon
                : volume < 10
                ? volumeLowIcon
                : volume < 75
                ? volumeMediumIcon
                : volumeHighIcon
            }
            alt="Volume"
            className="icon pixel-img margin-left-8 pixel-img"
          />
        </button>

        <input
          type="range"
          className="slider"
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(e.target.value)}
        />
      </div>

      {/* Song Info */}
      <p className="text-center">song track</p>
    </div>
  );
}
