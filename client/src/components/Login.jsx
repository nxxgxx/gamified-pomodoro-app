/*This basic login Component allows the user to submit their email and a password to login to the app. Will be adjusted later.*/
import { useEffect, useState } from "react";
import { useAuthUser } from "../security/AuthContext";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login } = useAuthUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/app"); // Redirect to the app if user is already authenticated
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    navigate("/app");
  };

  return (
    // login box
    <div className="flex-center radial">
      <div className="flex-column width-360px gap-40 pad-x-40 pad-y-20 white-100 border-black radius-8">
        {/* login title */}
        <h2 className="text-center">Log In</h2>
        {/* beginning of the login form */}
        <form onSubmit={handleSubmit} className="flex-column gap-40">
          {/* form items div */}
          <div className="flex-column gap-20">
            {/* email section */}
            <div className="flex-column gap-8">
              <label htmlFor="email">email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="my@email.com"
              />
            </div>
            {/* password section */}
            <div className="flex-column gap-8">
              <label htmlFor="password">password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
              />
            </div>
          </div>

          {/* submit form button */}
          <button
            type="submit"
            value="Login"
            className="btn-filled cyan-800 width-100"
          >
            Log In
          </button>
        </form>

        {/* quick redirect to sing up */}
        <div className="flex-column align-center">
          <p className="xs">
            Don't have an account?{" "}
            <Link to="/register">
              <a href="#">Click here</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
