// The header should be at the top of every webpade
// Depending on where the user is in their journey
// the header should change accordingly
// for example, if a user it not signed in,
// then they need to see the login/signup buttons in the nav

import { useAuthUser } from "../security/AuthContext";
import { useNavigate, Outlet, Link } from "react-router-dom";
import React from "react";
import logo from "../assets/visuals/pokedoro_img_logo.svg";

export default function Header({ isLoggedIn, showNav }) {
  const { user, logout } = useAuthUser();
  const navigate = useNavigate();

  return (
    <header className="flex-row space-between pad-x-48 pad-y-20 black-transparent-700">
      {!isLoggedIn ? (
        <img
          src={logo}
          alt="Pokedoro Logo"
          className="logo clickable"
          onClick={() => navigate("/")}
        />
      ) : (
        <img
          src={logo}
          alt="Pokedoro Logo"
          className="logo clickable"
          onClick={() => navigate("/app")}
        />
      )}

      <nav>
        <ul className="flex-row gap-40 align-center">
          {!isLoggedIn ? (
            //  if user is not logged in, display login/register buttons
            <>
              <li>
                <button
                  className="btn-outline"
                  onClick={() => navigate("/login")}
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  className="btn-filled green-800"
                  onClick={() => navigate("/register")}
                >
                  Create Account
                </button>
              </li>
            </>
          ) : isLoggedIn && showNav ? (
            // if user is logged in and nav should show, display pokemon/profile
            <>
              {/* READD LATER */}
              {/* <li>
                <button
                  className="btn-unfilled"
                  onClick={() => navigate("/app/pokemon")}
                >
                  Pokemon
                </button>
              </li> */}
              <li>
                <button
                  className="btn-unfilled"
                  onClick={() => navigate("/app/profile")}
                >
                  Profile
                </button>
              </li>
              {/* DELETE LATER ONCE PROFILE IS BUILT */}
              <li>
                <button
                  className="btn-filled pink-800"
                  onClick={async () => {
                    await logout();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : null}
        </ul>
      </nav>
    </header>
  );
}
