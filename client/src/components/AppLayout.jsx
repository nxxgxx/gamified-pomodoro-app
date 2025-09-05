/*This is the primary layout of the app. It will contain the header with links to the profile and Pokemon. It also manages the Router outlet 
all of the output content (the Widgets)*/

import { useAuthUser } from "../security/AuthContext";
import { fetchGetWithAuth } from "../security/fetchWithAuth";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";

import "../style/normalize.css";
import "../style/reset.css";
import "../style/style.css";

import Header from "./Header";

export default function AppLayout({ showNav }) {
  const { user } = useAuthUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkOnboarding() {
      if (!user) {
        navigate("/login");
        return;
      }

      if (location.pathname.startsWith("/onboard")) {
        setChecking(false);
        return;
      }

      try {
        const res = await fetchGetWithAuth(`${process.env.REACT_APP_API_URL}/app/profile`);

        if (!res.success) {
          console.warn("Invalid profile response:", res);
          navigate("/login");
          return;
        }

        if (!res.data.onboard_complete) {
          setChecking(false);
          navigate("/onboard");
        } else {
          setChecking(false);
        } 

      } catch (err) {
        console.error("Error fetching profile:", err);
        navigate("/login");
      }
    }

    checkOnboarding();
  }, [user, location.pathname, navigate]);

  if (checking) return <div>Authenticating user. . . </div>;

  return (
    <div className="background-tile">
      {/* Title bar / Menu */}
      <Header isLoggedIn={true} showNav={showNav} />

      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
