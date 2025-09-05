/*Simple Registration Component provided by the class materials that will register a user into the database.*/

import { useState } from "react";
import { useAuthUser } from "../security/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuthUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(email, password, username);
    navigate("/onboard");
  };

  return (
    // sign up box
    <div className="flex-center radial">
      <div className="flex-column width-360px gap-40 pad-x-40 pad-y-20 white-100 border-black radius-8">
        {/* sign up title */}
        <h2 className="text-center">Sign Up</h2>
        {/* beginning of the signup form */}
        <form onSubmit={handleSubmit} className="flex-column gap-40">
          {/* form items div */}
          <div className="flex-column gap-20">
            {/* username section */}
            <div className="flex-column gap-8">
              <label htmlFor="username">username</label>
              <input
                type="text"
                id="username"
                name="username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            {/* email section */}
            <div className="flex-column gap-8">
              <label htmlFor="email">email</label>
              <input
                type="email"
                id="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {/* password section */}
            <div className="flex-column gap-8">
              <label htmlFor="password">password</label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {/* submit form button */}
          <button
            type="submit"
            value="Get Started"
            className="btn-filled green-800 width-100"
          >
            Create Account
          </button>
        </form>

        {/* quick redirect to sing up */}
        <div className="flex-column align-center">
          <p className="xs">
            Already have an account?{" "}
            <Link to="/login">
              <a href="#">Click here</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
