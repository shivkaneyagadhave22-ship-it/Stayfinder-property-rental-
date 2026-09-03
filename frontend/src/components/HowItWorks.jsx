import "./HowItWorks.css";

function HowItWorks() {
  return (
    <section className="how-it-works">

      <div className="how-header">
        <span className="how-tag">HOW IT WORKS</span>

        <h2>Find Your Perfect Stay in 3 Easy Steps</h2>

        <p>
          Simple, fast and hassle-free property booking.
        </p>
      </div>

      <div className="steps-container">

        {/* STEP 1 */}
        <div className="step-item">

          <div className="step-number">
            01
          </div>

          <div className="step-content">
            <h3>Search</h3>

            <p>
              Search properties by location,
              budget and your preferences.
            </p>
          </div>

        </div>


        <div className="step-arrow">
          →
        </div>


        {/* STEP 2 */}
        <div className="step-item">

          <div className="step-number">
            02
          </div>

          <div className="step-content">
            <h3>Explore</h3>

            <p>
              Explore listings, check details
              and compare properties.
            </p>
          </div>

        </div>


        <div className="step-arrow">
          →
        </div>


        {/* STEP 3 */}
        <div className="step-item">

          <div className="step-number">
            03
          </div>

          <div className="step-content">
            <h3>Book</h3>

            <p>
              Contact the owner and
              book your perfect stay.
            </p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default HowItWorks;