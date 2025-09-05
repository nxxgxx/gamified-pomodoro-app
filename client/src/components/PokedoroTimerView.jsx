/*The Timer component is the pomodoro timer interface. It will be able to start, stop, refresh, and adjust settings. 
Upon starting a session, a timer will be added to the User's timer history, and upon completion it will update that db entry.
Currently not implemented.*/

import { useState, useEffect, useRef, useCallback } from "react";
import { fetchPostWithAuth } from "../security/fetchWithAuth";
import { useMode } from "../context/ModeContext";
import { MODES } from "../constants";

// import icons for settings
import restartIcon from "../assets/visuals/pokedoro_icon_refresh.svg";
import settingsIcon from "../assets/visuals/pokedoro_icon_settings.svg";

export default function PokedoroTimerView({
  focusDuration,
  breakDuration,
  restDuration,
  setView,
  pokemonTheme,
  selected,
  fetchSelectedPokemon, // <-- just use as a prop passed from parent
}) {
  const { mode, setMode } = useMode();
  const [timeLeft, setTimeLeft] = useState(focusDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [cycleCount, setCycleCount] = useState(0);
  const timerRef = useRef(null); // Similar to useState, but does not trigger re-render

  let titleText = "";

  switch (mode) {
    case MODES.FOCUS:
      titleText = "Stay focused!";
      break;
    case MODES.BREAK:
      titleText = "Take a break!";
      break;
    case MODES.REST:
      titleText = "You've earned a rest!";
      break;
    default:
      titleText = "Ready to train?";
  }

  const handleComplete = useCallback(async () => {
    setIsRunning(false);
    const end = new Date();

    const getModeDuration = (mode) => {
      switch (mode) {
        case MODES.FOCUS:
          return focusDuration;
        case MODES.BREAK:
          return breakDuration;
        case MODES.REST:
          return restDuration;
        default:
          return focusDuration;
      }
    };

    if (mode === MODES.FOCUS) {
      // Log the completed session
      try {
        await fetchPostWithAuth(`${process.env.REACT_APP_API_URL}/timers`, {
          start_time:
            startTime?.toISOString() ||
            new Date(end.getTime() - focusDuration * 1000).toISOString(),
          end_time: end.toISOString(),
          duration: Math.round((focusDuration - timeLeft) / 60), // In minutes
          completed: true,
        });

        // Call the XP / evolution endpoint too
        await fetchPostWithAuth(`${process.env.REACT_APP_API_URL}/timer/complete`, {
          duration: Math.round((focusDuration - timeLeft) / 60), // In minutes
        });

        // Re-fetch updated selected Pokémon to update XP in UI
        await fetchSelectedPokemon();

        // @TODO: This needs to change from a popup alert to become a message to the status board
        // alert(`${selected?.pokemon.name || "Your pokemon"} trained for ${Math.floor(focusDuration / 60)} ${Math.floor(focusDuration / 60) === 1 ? "minute" : "minutes"}!`);
      } catch (err) {
        console.error("Failed to log session:", err);
      }

      const newCycleCount = cycleCount + 1;
      setCycleCount(newCycleCount);

      // Rest every 4 cycles, otherwise break
      const nextMode = newCycleCount % 4 === 0 ? MODES.REST : MODES.BREAK;
      setMode(nextMode);
      setTimeLeft(getModeDuration(nextMode));

      // Automatically start the next timer
      setStartTime(new Date());
      setIsRunning(true);
    } else {
      // When coming from Break or Rest, start a new focus session
      setMode(MODES.FOCUS);
      setTimeLeft(focusDuration);
      setStartTime(new Date());
      setIsRunning(true);
    }
  }, [
    timeLeft,
    startTime,
    focusDuration,
    breakDuration,
    restDuration,
    cycleCount,
    mode,
    setMode,
    fetchSelectedPokemon,
  ]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000); // 1 second timeout that decrements the timeLeft by 1 second
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, handleComplete]);

  const handleStart = () => {
    setStartTime(new Date()); // Sets actual start time
    setTimeLeft(focusDuration);
    setIsRunning(true);
  };

  const handlePause = () => setIsRunning(false); // Stops the interval; keeps timeLeft as-is
  const handleResume = () => setIsRunning(true);  // Resumes countdown from current timeLeft
  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setStartTime(null);
    setTimeLeft(focusDuration);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* title */}
      <div>
        <h3 className="text-center">{titleText}</h3>
      </div>

      {/* time on clock */}
      <div>
        <p className="timer text-center">{formatTime(timeLeft)}</p>
      </div>

      {/* buttons */}
      <div className="flex-row white-100-text white justify-center">
        <button onClick={handleReset}>
          <img src={restartIcon} alt="" className="icon dark pixel-img xl" />
        </button>

        {isRunning ? (
          <button
            className={`btn-filled width-100px ${pokemonTheme.header}`}
            onClick={handlePause}
          >
            Pause
          </button>
        ) : timeLeft < focusDuration && timeLeft > 0 ? (
          <button
            className={`btn-filled width-100px ${pokemonTheme.header}`}
            onClick={handleResume}
          >
            Resume
          </button>
        ) : (
          <button
            className={`btn-filled width-100px ${pokemonTheme.header}`}
            onClick={handleStart}
          >
            Start
          </button>
        )}

        <button onClick={() => setView("SETTINGS")}>
          <img src={settingsIcon} alt="" className="icon dark pixel-img xl" />
        </button>
        </div>
    </>
  );
}