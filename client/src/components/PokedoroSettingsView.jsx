import chevronIcon from "../assets/visuals/pokedoro_icon_angle_down.svg";

export default function PokedoroSettingsView({
  focusDuration,
  breakDuration,
  restDuration,
  setFocusDuration,
  setBreakDuration,
  setRestDuration,
  setView,
}) {
  return (
    <div className="timer-settings height-100 flex-column gap-20">
      {/* back button */}
      <div className="white-100-text white">
        <button
          onClick={() => setView("TIMER")}
          className="flex-row gap-8 icon-btn"
        >
          <img src={chevronIcon} alt="" className="flip-left" />
          Back
        </button>
      </div>

      <div className="flex-column gap-16">
        {/* timer title */}
        <div>
          <h4>Timer Settings</h4>
          <p className="xs">Adjust your timers in minutes</p>
        </div>

        <div className="flex-column gap-32">
          {/* timer settings */}
          <div className="flex-row gap-8">
            <label>
              Focus
              <input
                type="number"
                value={focusDuration / 60}
                onChange={(e) => setFocusDuration(e.target.value * 60)}
              />
            </label>
            <label>
              Break
              <input
                type="number"
                value={breakDuration / 60}
                onChange={(e) => setBreakDuration(e.target.value * 60)}
              />
            </label>
            <label>
              Rest
              <input
                type="number"
                value={restDuration / 60}
                onChange={(e) => setRestDuration(e.target.value * 60)}
              />
            </label>
          </div>

          {/* settings */}
          <div className="flex-column gap-20">
            <label className="custom-checkbox dark">
              <input type="checkbox" id="toggle-auto-timer" />
              <span className="checkmark"></span>Auto-transition timer
            </label>
            <label className="custom-checkbox dark">
              <input type="checkbox" id="toggle-pokemon-theme" />
              <span className="checkmark"></span>Pokemon theme
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
