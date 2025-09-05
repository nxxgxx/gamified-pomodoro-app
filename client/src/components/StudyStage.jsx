/*This simple StudyStage Component is a banner above the other widgets to show what session the user is in. */
import { useMode } from "../context/ModeContext";
import { MODES } from "../constants";

export default function StudyStage() {
  const mode = useMode();

  return (
    <div className="width-100 flex-row justify-between">
      <div
        className={`timer-label ${
          mode === MODES.FOCUS ? "active" : "inactive"
        }`}
      >
        FOCUS
      </div>
      <div
        className={`timer-label ${
          mode === MODES.BREAK ? "active" : "inactive"
        }`}
      >
        BREAK
      </div>
      <div
        className={`timer-label ${mode === MODES.REST ? "active" : "inactive"}`}
      >
        REST
      </div>
    </div>
  );
}
