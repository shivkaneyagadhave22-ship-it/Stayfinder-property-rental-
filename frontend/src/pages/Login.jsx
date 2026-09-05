import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =========================
  // LOGIN FUNCTION
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();

    // Check empty fields
    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // CONNECT WITH BACKEND
      // =========================
      const response = await fetch(
      "https://stayfinder-property-rental.onrender.com/api/auth/login",
 
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        }
      );

      // Convert response to JSON
      const data = await response.json();

      console.log("Login Response:", data);

      // =========================
      // LOGIN FAILED
      // =========================
      if (!response.ok || !data.success) {
        alert(data.message || "Invalid email or password");
        return;
      }

      // =========================
      // SAVE LOGIN TOKEN
      // =========================
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // =========================
      // SAVE USER INFORMATION
      // =========================
      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      // =========================
      // LOGIN SUCCESS
      // =========================
      alert("Login successful!");

      // =========================
      // GO TO ROLE SELECTION
      // =========================
      navigate("/select-role");

    } catch (error) {
      console.error("Login Error:", error);

      alert(
        "Unable to connect to backend. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-container">

        {/* =========================
            LEFT SIDE
        ========================== */}

        <div className="login-left">

          {/* LOGO */}
          <div className="login-logo">
            🏠 StayFinder
          </div>

          {/* INTRO */}
          <div className="login-intro">

            <h1>Welcome Back!</h1>

            <p>
              Login to discover beautiful properties and find your
              perfect stay.
            </p>

            {/* BENEFITS */}
            <div className="login-benefits">

              <div className="benefit-item">
                <span>✓</span>
                <p>Verified Properties</p>
              </div>

              <div className="benefit-item">
                <span>✓</span>
                <p>Best Price Guarantee</p>
              </div>

              <div className="benefit-item">
                <span>✓</span>
                <p>Easy & Secure Booking</p>
              </div>

            </div>

          </div>

        </div>


        {/* =========================
            RIGHT SIDE
        ========================== */}

        <div className="login-right">

          <div className="login-form-box">

            <h2>Login to StayFinder</h2>

            <p className="login-subtitle">
              Enter your details to continue
            </p>


            {/* =========================
                LOGIN FORM
            ========================== */}

            <form onSubmit={handleLogin}>

              {/* EMAIL */}

              <div className="login-field">

                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  autoComplete="email"
                />

              </div>


              {/* PASSWORD */}

              <div className="login-field">

                <div className="password-heading">

                  <label>Password</label>

                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() =>
                      alert(
                        "Forgot Password feature coming soon"
                      )
                    }
                  >
                    Forgot Password?
                  </button>

                </div>


                <div className="password-input-wrapper">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    autoComplete="current-password"
                  />

                  <button
                    type="button"
                    className="password-eye"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>

                </div>

              </div>


              {/* =========================
                  REMEMBER ME
              ========================== */}

              <div className="remember-me">

                <label>

                  <input
                    type="checkbox"
                  />

                  Remember me

                </label>

              </div>


              {/* =========================
                  LOGIN BUTTON
              ========================== */}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login"}
              </button>

            </form>


            {/* =========================
                REGISTER
            ========================== */}

            <p className="register-text">

              Don't have an account?{" "}

              <Link to="/register">
                Register
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;