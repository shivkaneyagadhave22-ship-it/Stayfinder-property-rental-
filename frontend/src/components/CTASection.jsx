import "./CTASection.css";

function CTASection () {
    return (
        <section className="cta-section">
            <div className="cta-content">
                <h2>
                    Ready To Find Your Perfect Stay ?
                </h2>

                <p>
                    Explore verified properties and find a place
                    that feels like home.
                </p>
            </div>

            <button className="cta-btn">
                Explore Properties
                <span>→</span>
            </button>
        </section>
    );
}
export default CTASection;