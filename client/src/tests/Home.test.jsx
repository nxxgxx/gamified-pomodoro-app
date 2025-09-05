/*Basic test file provided with class materials*/
/* Home.test revised NAT*/

import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "../components/Home";
import { useAuthUser } from "../security/AuthContext";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn(),
}));

jest.mock("../security/AuthContext");

describe("Home Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    require("react-router-dom").useNavigate.mockReturnValue(mockNavigate);
  });

  test("renders the hero heading and Get Started button", () => {
    useAuthUser.mockReturnValue({ isAuthenticated: false });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Begin your trainer journey, one timer at a time!")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /get started now!/i })
    ).toBeInTheDocument();
  });

  test("navigates to register page when Get Started button is clicked", () => {
    useAuthUser.mockReturnValue({ isAuthenticated: false });

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", {
      name: /get started now!/i,
    });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });
});
