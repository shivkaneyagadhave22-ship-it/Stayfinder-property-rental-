import img1 from "../assets/images/img-1.jpg";
import img2 from "../assets/images/img-2.jpg";
import img3 from "../assets/images/img-3.jpg";

import "./FeaturedProperties.css";

function FeaturedProperties() {

  const properties = [
    {
      id: 1,
      image: img1,
      title: "Modern 2 BHK Apartment",
      location: "Hinjawadi, Pune",
      price: "₹25,000 / month",
      beds: "2 Beds",
      baths: "2 Baths",
      area: "950 sqft",
    },

    {
      id: 2,
      image: img2,
      title: "Luxury Villa",
      location: "Baner, Pune",
      price: "₹45,000 / month",
      beds: "4 Beds",
      baths: "4 Baths",
      area: "2500 sqft",
    },

    {
      id: 3,
      image: img3,
      title: "Cozy 1 BHK Home",
      location: "Wakad, Pune",
      price: "₹18,000 / month",
      beds: "1 Bed",
      baths: "1 Bath",
      area: "600 sqft",
    },
  ];


  return (
    <section className="featured-properties">

      {/* ================================
          SECTION HEADER
      ================================= */}

      <div className="featured-header">

        <div>

          <span className="section-tag">
            FEATURED PROPERTIES
          </span>

          <h2>
            Explore Our Latest Properties
          </h2>

          <p>
            Handpicked properties for your perfect stay.
          </p>

        </div>


        <button className="view-all-btn">
          View All Properties
        </button>

      </div>


      {/* ================================
          PROPERTY CARDS
      ================================= */}

      <div className="featured-property-grid">

        {properties.map((property) => (

          <div
            className="featured-property-card"
            key={property.id}
          >

            {/* IMAGE */}

            <div className="featured-property-image">

              <img
                src={property.image}
                alt={property.title}
              />


              {/* For Rent */}

              <span className="featured-property-badge">
                For Rent
              </span>


              {/* Wishlist */}

              <button className="featured-wishlist-btn">
                ♡
              </button>

            </div>


            {/* CONTENT */}

            <div className="featured-property-content">

              <h3>
                {property.title}
              </h3>


              {/* Location */}

              <p className="featured-property-location">
                📍 {property.location}
              </p>


              {/* Price */}

              <div className="featured-property-price">
                {property.price}
              </div>


              {/* Details */}

              <div className="featured-property-details">

                <span>
                  🛏 {property.beds}
                </span>

                <span>
                  🛁 {property.baths}
                </span>

                <span>
                  📐 {property.area}
                </span>

              </div>


              {/* Button */}

              <button className="featured-details-btn">
                View Details
              </button>

            </div>

          </div>

        ))}

      </div>

    </section>
  );
}

export default FeaturedProperties;