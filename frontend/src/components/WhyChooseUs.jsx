import "./WhyChooseUs.css";

function WhyChooseUs () {
    const features = [
        {
            id:1,
            icon:"✓",
            title:"Verified Properties",
            description:"Every property is carefully verified for yoour safety."
        },
        {
            id:2,
            icon:"🏷",
            title:"Best Prices",
            description:"We provide the best prices with no hidden charges."
        },
        {
            id:3,
            icon:"⚡",
            title:"Easy Booking",
            description:"Simple and hassle-free booking process."
        },
        {
            id:4,
            icon:"🎧",
            title:"Trusted Support",
            description:"Our support team is always ready to help you."
        },
    ];
        return (
            <section className="why-choose-section">
                <div className="why-choose-header">
                    <span className="section-tag">
                        WHY CHOOSE STAYFINDER
                    </span>
                </div>

                <div className="why-choose-grid">
                    {features.map((feature) => (
                    <div className="why-choose-card" key={feature.id}>

                        <div className="why-icon">
                            {feature.icon}
                        </div>

                        <h3>
                            {feature.title}
                        </h3>

                        <p>
                            {feature.description}
                        </p>
                </div>
                ))}
                </div>
            </section>
        );
}
export default WhyChooseUs;