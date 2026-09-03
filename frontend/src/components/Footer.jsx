import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">

          <h2>
            🏠 <span>StayFinder</span>
          </h2>

          <p>
            Find your perfect home with ease.
            Verified properties, best prices and
            trusted support.
          </p>

          <div className="social-icons">
            <span>f</span>
            <span>◎</span>
            <span>𝕏</span>
            <span>in</span>
          </div>

        </div>


        {/* QUICK LINKS */}
        <div className="footer-column">

          <h3>Quick Links</h3>

          <a href="/">Home</a>
          <a href="/properties">Properties</a>
          <a href="#">About Us</a>
          <a href="#">Contact</a>

        </div>


        {/* SUPPORT */}
        <div className="footer-column">

          <h3>Support</h3>

          <a href="#">Help Center</a>
          <a href="#">FAQs</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms & Conditions</a>

        </div>


        {/* FOR OWNERS */}
        <div className="footer-column">

          <h3>For Owners</h3>

          <a href="#">Add Property</a>
          <a href="#">My Properties</a>
          <a href="#">Owner Dashboard</a>

        </div>


        {/* NEWSLETTER */}
        <div className="footer-newsletter">

          <h3>Newsletter</h3>

          <p>
            Subscribe to get updates on new
            properties and offers.
          </p>

          <div className="newsletter-box">

            <input
              type="email"
              placeholder="Enter your email"
            />

            <button>➤</button>

          </div>

        </div>

      </div>


      {/* FOOTER BOTTOM */}

      <div className="footer-bottom">

        <p>
          © 2026 StayFinder. All rights reserved.
        </p>

      </div>

    </footer>
  );
}

export default Footer;