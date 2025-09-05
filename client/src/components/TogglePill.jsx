import { useState } from "react";
import chevronIcon from "../assets/visuals/pokedoro_icon_angle_down.svg";

export default function TogglePill({
  hasIcon,
  color,
  name,
  currentState,
  onClick,
}) {
  const clickStates = hasIcon ? 3 : 2;
  const currentColor = color || "gradient-green";
  const displayName = name || "Uncommon";

  const iconClass =
    hasIcon && currentState === 2 ? "icon flip-upsidedown" : "icon";

  return (
    <button
      className={`${currentColor} ${
        currentState > 0 ? "active" : ""
      } pokemon-pill flex-row align-center pad-x-8 pad-y-4 gap-4 radius-4 text-shadow clickable`}
      onClick={onClick}
    >
      {displayName}
      {hasIcon && currentState > 0 && (
        <img src={chevronIcon} alt="" className={iconClass} />
      )}
    </button>
  );
}
