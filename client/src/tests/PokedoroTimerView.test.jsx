import { render, screen } from "@testing-library/react";
import PokedoroTimerView from "../components/PokedoroTimerView";

// MOCK the useMode hook from ModeContext - so our components dont crash (custom hook)
jest.mock("../context/ModeContext", () => ({
  useMode: () => ({
    mode: "READY",
    setMode: jest.fn(),
  }),
}));

describe("PokedoroTimerView Component", () => {
  test("renders timer with initial focus time and Start button", () => {
    render(
      <PokedoroTimerView
        focusDuration={1500} // 25:00
        breakDuration={300}
        restDuration={900}
        setView={() => {}}
        pokemonTheme={{ header: "green" }}
      />
    );

    // These assertions should now work
    expect(screen.getByText("Ready to train?")).toBeInTheDocument();
    expect(screen.getByText("25:00")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
  });
});
