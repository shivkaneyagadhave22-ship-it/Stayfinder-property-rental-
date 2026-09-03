import "./PropertyCard.css";

function PropertyCard({
  image,
  title,
  location,
  price,
  beds,
  baths,
  area,
}) {
  return (
    <div className="property-card">

      {/* Property Image */}
      <div className="property-card-image">

        <img
          src={image}
          alt={title}
        />

        {/* For Rent Badge */}
        <span className="property-badge">
          For Rent
        </span>

        {/* Wishlist */}
        <button className="wishlist-btn">
          ♡
        </button>

      </div>


      {/* Property Information */}
      <div className="property-card-content">

        <h3>
          {title}
        </h3>


        {/* Location */}
        <p className="property-location">
          📍 {location}
        </p>


        {/* Price */}
        <div className="property-price">
          ₹{price} <span>/ month</span>
        </div>


        {/* Property Details */}
        <div className="property-details">

          <span>
            🛏 {beds} Beds
          </span>

          <span>
            🛁 {baths} Baths
          </span>

          <span>
            📐 {area} sqft
          </span>

        </div>


        {/* Button */}
        <button className="view-details-btn">
          View Details
        </button>

      </div>

    </div>
  );
}

export default PropertyCard;