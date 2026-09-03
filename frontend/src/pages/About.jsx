import "./About.css";

function About() {
  return (
    <div className="about-page">

      <div className="about-container">

        <div className="about-header">
          <div className="about-logo">
            🏠 StayFinder
          </div>

          <h1>About StayFinder</h1>

          <p>
            Making it easier to find a comfortable place to stay.
          </p>
        </div>

        <div className="about-content">

          <div>
            <h2>Our Mission</h2>

            <p>
              StayFinder is a property rental platform designed to
              connect tenants with property owners in a simple and
              convenient way.
            </p>

            <p>
              Users can browse properties, view property details,
              save their favourite properties and send booking
              requests to owners.
            </p>
          </div>

          <div className="about-cards">

            <div className="about-card">
              🔍
              <h3>Easy Search</h3>
              <p>Find properties easily.</p>
            </div>

            <div className="about-card">
              🏠
              <h3>Verified Properties</h3>
              <p>Explore available properties.</p>
            </div>

            <div className="about-card">
              ❤️
              <h3>Wishlist</h3>
              <p>Save properties you like.</p>
            </div>

            <div className="about-card">
              🤝
              <h3>Connect</h3>
              <p>Connect tenants and owners.</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default About;