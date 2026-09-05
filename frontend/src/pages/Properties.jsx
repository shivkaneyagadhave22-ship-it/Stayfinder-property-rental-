import { useState, useEffect } from "react";
import "./Properties.css";

function Properties() {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("All Property Types");

  // const properties = [
  //   {
  //     id: 1,
  //     title: "Modern 2 BHK Apartment",
  //     type: "Apartment",
  //     location: "Baner, Pune, Maharashtra",
  //     beds: 2,
  //     baths: 2,
  //     area: 950,
  //     rent: 25000,
  //     image:
  //       "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  //   },

  //   {
  //     id: 2,
  //     title: "Luxury 3 BHK Apartment",
  //     type: "Apartment",
  //     location: "Wakad, Pune, Maharashtra",
  //     beds: 3,
  //     baths: 2,
  //     area: 1200,
  //     rent: 32000,
  //     image:
  //       "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80",
  //   },

  //   {
  //     id: 3,
  //     title: "Beautiful Family House",
  //     type: "House",
  //     location: "Kothrud, Pune, Maharashtra",
  //     beds: 3,
  //     baths: 3,
  //     area: 1500,
  //     rent: 40000,
  //     image:
  //       "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  //   },
  // ];
  const [properties, setProperties] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchProperties = async () => {
    try {
      const response = await fetch("https://stayfinder-property-rental.onrender.com");
      const result = await response.json();

      if (result.success) {
        setProperties(result.data);
      } else {
        console.error("Failed to fetch properties");
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchProperties();
}, []);

  const filteredProperties = properties.filter((property) => {
    const locationMatch = property.location
      .toLowerCase()
      .includes(location.toLowerCase());

    const typeMatch =
      propertyType === "All Property Types" ||
      property.propertyType === propertyType;

    return locationMatch && typeMatch;
  });

  return (
    <div className="properties-page">

      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="properties-header">

        <div>
          <h1>Available Properties</h1>

          <p>
            Find your perfect home with StayFinder.
          </p>
        </div>

        <div className="available-badge">
          <span>●</span>
          Available Properties
        </div>

      </div>


      {/* =========================
          SEARCH BOX
      ========================== */}
      <div className="property-search">

        {/* Location */}
        <div className="search-location">

          <span className="search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search by location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

        </div>


        {/* Property Type */}
        <div className="search-type">

          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
          >
            <option>All Property Types</option>
            <option>Apartment</option>
            <option>House</option>
            <option>Villa</option>
            <option>PG</option>
            <option>Rental Home</option>
          </select>

        </div>


        {/* Search Button */}
        <button className="search-property-btn">
          Search
        </button>

      </div>


      {/* =========================
          PROPERTY CARDS
      ========================== */}
      <div className="properties-grid">

        {filteredProperties.length > 0 ? (

          filteredProperties.map((property) => (

            <div
              className="property-card"
              key={property._id}
            >

              {/* IMAGE */}
              <div className="property-image-wrapper">

                <img
                  src={property.image}
                  alt={property.title}
                  className="property-image"
                />

                {/* Available */}
                <span className="property-available">
                  Available
                </span>


                {/* Heart */}
                <button className="property-heart">
                  ♡
                </button>

              </div>


              {/* CARD CONTENT */}
              <div className="property-content">

                {/* Property Type */}
                <span className="property-type">
                  {property.propertyType}
                </span>


                {/* Title */}
                <h2>
                  {property.title}
                </h2>


                {/* Location */}
                <div className="property-location">
                  <span>📍</span>
                  <span>{property.location}</span>
                </div>


                {/* Amenities */}
                <div className="property-amenities">

                  <span>
                    🛏️ {property.bedrooms} Beds
                  </span>

                  <span>
                    🛁 {property.bathrooms} Baths
                  </span>

                  <span>
                    ▧ {property.area} sq.ft.
                  </span>

                </div>


                <div className="property-divider"></div>


                {/* Bottom */}
                <div className="property-bottom">

                  <div className="property-price">

                    <strong>
                      ₹{property.rent.toLocaleString("en-IN")}
                    </strong>

                    <span>/ month</span>

                  </div>


                  <button className="view-details-btn">
                    View Details
                    <span>→</span>
                  </button>

                </div>

              </div>

            </div>

          ))

        ) : (

          <div className="no-properties">

            <div className="no-property-icon">
              🏠
            </div>

            <h2>
              No properties found
            </h2>

            <p>
              Try another location or property type.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default Properties;