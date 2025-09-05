import React from "react";

export default function SelectableSprite({ imgSrc, isSelected, onClick, alt }) {
  return (
    <div
      className={`sprite-container ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <img
        src={imgSrc}
        alt={alt || "sprite"}
        className="sprite-image pixel-img"
      />
    </div>
  );
}
