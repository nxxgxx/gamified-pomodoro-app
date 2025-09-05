import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { fetchPostWithAuth } from "../security/fetchWithAuth";

export default function PageAccountDeleted() {
  const navigate = useNavigate();

  useEffect(() => {
    async function clearAuthCookie(){
      try {
        await fetchPostWithAuth(`${process.env.REACT_APP_API_URL}/auth/clear_cookie`);
      } catch (err) {
        console.error("Error when destroying token:", err);
      }
    }

    clearAuthCookie();
  }, []);


  return (
    <div className=" pad-y-80 flex-center radial  white-100-text">
      <div className="flex-column width-360px gap-40">
        <h3 className="text-center">Account Deleted</h3>
        <div className="flex-column gap-8">
          <p>Thanks for being a part of Pokedoro!</p>
          <p>
            We’ve safely deleted your data. If you ever decide to return, your
            next Pokemon journey will be ready to begin.
          </p>
        </div>
        {/* button home */}
        <button className="btn-filled red-800" onClick={() => navigate("/")}>
          Go Back Home
        </button>
      </div>
    </div>
  );
}
