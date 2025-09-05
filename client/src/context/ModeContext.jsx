import { createContext, useContext, useState } from "react";
import { MODES } from "../constants";

const ModeContext = createContext();

export function ModeProvider({ children }) {
    const [mode, setMode] = useState(MODES.FOCUS);

    return (
        <ModeContext.Provider value={{mode, setMode}}>
            {children}
        </ModeContext.Provider>
    );
}

export function useMode() {
    return useContext(ModeContext);
}
