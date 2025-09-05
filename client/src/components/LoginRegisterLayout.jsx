import { Outlet } from "react-router-dom";

import "../style/normalize.css";
import "../style/reset.css";
import "../style/style.css";

import Header from "./Header";

export default function LoginRegisterLayout() {
  return (
    <div className="app background-tile height-min-100vh">
      <Header isLoggedIn={false} showNav={false} />

      <div className="content widgets">
        <Outlet />
      </div>
    </div>
  );
}
