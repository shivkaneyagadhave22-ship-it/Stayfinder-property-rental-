import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container">

        {/* Logo */}
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
        >
          🏠 <span>StayFinder</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation */}
        <div
          className="collapse navbar-collapse"
          id="navbarNav"
        >

          <ul className="navbar-nav ms-auto navbar-menu">

            {/* Home */}
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {/* Properties */}
            <li className="nav-item">
              <Link className="nav-link" to="/properties">
                Properties
              </Link>
            </li>

            {/* Contact */}
            <li className="nav-item">
              <Link className="nav-link" to="/contact">
                Contact
              </Link>
            </li>

            {/* About */}
            <li className="nav-item">
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>

            {/* Login */}
            <li className="nav-item navbar-action">
              <Link
                className="login-btn"
                to="/login"
              >
                Login
              </Link>
            </li>

            {/* Register */}
            <li className="nav-item navbar-action">
              <Link
                className="register-btn"
                to="/register"
              >
                Register
              </Link>
            </li>

          </ul>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;