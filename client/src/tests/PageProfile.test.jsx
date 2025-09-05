import { render, screen } from "@testing-library/react";
import PageProfile from "../components/PageProfile";
import { MemoryRouter } from "react-router-dom";

test("renders loading text initially", () => {
  render(
    <MemoryRouter>
      <PageProfile />
    </MemoryRouter>
  );

  expect(screen.getByText(/trainer profile loading/i)).toBeInTheDocument();
});
