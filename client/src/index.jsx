import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ModeProvider } from "./context/ModeContext";
import { InventoryProvider } from "./context/InventoryContext";

// unsigned in elements
import LoginRegisterLayout from "./components/LoginRegisterLayout";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";

// signed in elements
import AppLayout from "./components/AppLayout";
import Widgets from "./components/Widgets";
import PagePokemon from "./components/PagePokemon";
import PageProfile from "./components/PageProfile";
import PageAccountDeleted from "./components/PageAccountDeleted";

// onboard elements
import OnboardIntro from "./components/OnboardIntro";
import OnboardStarter from "./components/OnboardStarter";
import OnboardStyle from "./components/OnboardStyle";

// no page found
import NotFound from "./components/NotFound";

import { AuthProvider } from "./security/AuthContext";
import RequireAuth from "./security/RequireAuth";

const container = document.getElementById("root");

const root = ReactDOMClient.createRoot(container);

root.render(
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* this route is for the main page (unsigned user) */}
        <Route path="/" element={<LoginRegisterLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* this route is for a user who is onboarding */}
        <Route
          path="/onboard"
          element={
            <RequireAuth>
              <InventoryProvider>
                <AppLayout showNav={false} />
              </InventoryProvider>
            </RequireAuth>
          }
        >
          <Route index element={<OnboardIntro />} />
          <Route path="style" element={<OnboardStyle />} />
          <Route path="starter" element={<OnboardStarter />} />
        </Route>

        {/* route for users who's accounts are complete */}
        <Route
          path="/app"
          element={
            <RequireAuth>
              <InventoryProvider>
                <ModeProvider>
                  <AppLayout showNav={true} />
                </ModeProvider>
              </InventoryProvider>
            </RequireAuth>
          }
        >
          <Route index element={<Widgets />} />
          <Route path="pokemon" element={<PagePokemon />} />
          <Route path="profile" element={<PageProfile />} />
          <Route path="account-deleted" element={<PageAccountDeleted />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);
