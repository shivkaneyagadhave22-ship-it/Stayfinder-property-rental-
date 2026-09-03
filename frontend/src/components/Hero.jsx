import SearchBar from "./SearchBar";
import "./Hero.css";

function Hero() {
  return (
    <>
      <section className="hero">

        <div className="hero-content">

          <div className="hero-tag">
            Find Your Perfect Stay
          </div>

          <h1>Find Your Next Home</h1>

          <p>
            Discover apartments, villas, PGs and rental homes
            at the best locations.
          </p>

          <SearchBar />

        </div>

      </section>

      {/* Features Section */}
      <section className="features">

        <div className="feature-card">
          <div className="feature-icon">🏢</div>

          <div>
            <h5>Verified Properties</h5>
            <p>100% Verified Listings</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">💰</div>

          <div>
            <h5>Best Price</h5>
            <p>Price Match Guarantee</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📅</div>

          <div>
            <h5>Easy Booking</h5>
            <p>Hassle Free Process</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🎧</div>

          <div>
            <h5>24/7 Support</h5>
            <p>We Are Here To Help</p>
          </div>
        </div>

      </section>
    </>
  );
}

export default Hero;