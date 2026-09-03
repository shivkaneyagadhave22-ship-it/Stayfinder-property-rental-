import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // =========================
    // VALIDATION
    // =========================

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // CONNECT TO BACKEND
      // =========================

      const response = await fetch(
        "https://stayfinder-property-rental.onrender.com",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password: password,
            role: role,
            phone: "9876543210",
          }),
        }
      );

      const data = await response.json();

      console.log("Register Response:", data);

      // =========================
      // REGISTER FAILED
      // =========================

      if (!response.ok || !data.success) {
        alert(data.message || "Registration failed");
        return;
      }

      // =========================
      // SUCCESS
      // =========================

      alert("Registration successful! Please login.");

      navigate("/login");

    } catch (error) {
      console.error("Register Error:", error);

      alert(
        "Unable to connect to backend. Please make sure the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-container">

        {/* =========================
            LEFT SIDE
        ========================== */}

        <div className="register-left">

          <div className="register-logo">
            🏠 StayFinder
          </div>

          <h1>Find Your Perfect Stay</h1>

          <p>
            Create your StayFinder account and discover
            comfortable homes at the best locations.
          </p>

          <div className="register-benefits">
            <p>✓ Browse verified properties</p>
            <p>✓ Save your favourite homes</p>
            <p>✓ Connect with property owners</p>
          </div>

        </div>


        {/* =========================
            RIGHT SIDE
        ========================== */}

        <div className="register-right">

          <h2>Create Account</h2>

          <p className="register-subtitle">
            Join StayFinder today
          </p>


          <form onSubmit={handleRegister}>

            {/* NAME */}

            <div className="register-field">

              <label>Full Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

            </div>


            {/* EMAIL */}

            <div className="register-field">

              <label>Email Address</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

            </div>


            {/* PASSWORD */}

            <div className="register-field">

              <label>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="register-field">

              <label>Confirm Password</label>

              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

            </div>


            {/* ROLE */}

            <div className="register-field">

              <label>Register As</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="tenant">
                  Tenant / User
                </option>

                <option value="owner">
                  Property Owner
                </option>
              </select>

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="register-submit"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>


          {/* LOGIN */}

          <p className="login-text">

            Already have an account?

            <Link to="/login">
              {" "}Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;