import "./PropertyCategories.css";

function PropertyCategories() {
  return (
    <section className="property-categories">

      {/* Heading */}
      <div className="category-heading">
        <span className="category-label">
          POPULAR CATEGORIES
        </span>

        <h2>Explore by Property Type</h2>

        <p>
          Find the perfect property that suits your lifestyle and budget.
        </p>
      </div>


      {/* Property Cards */}
      <div className="category-cards">

        {/* Apartment */}
        <div className="category-card">

          <div className="category-image">
            <img
              src="https://www.radiancerealty.in/images/the_prime_img/mob_banner.jpg"
              alt="Apartments"
            />
          </div>

          <div className="category-content">

            <div className="category-icon">
              🏢
            </div>

            <h3>Apartments</h3>

            <p>Find your ideal apartment</p>

            <span>1200+ Properties</span>

          </div>

        </div>


        {/* Villas */}
        <div className="category-card">

          <div className="category-image">
            <img
              src="https://www.vtprealty.in/images/project/project-details/velvet-villas-by-vtp-luxe-kharadi-pune/velvetvilla_70f24a311d.webp"
              alt="Villas"
            />
          </div>

          <div className="category-content">

            <div className="category-icon">
              🏡
            </div>

            <h3>Villas</h3>

            <p>Luxury villas for rent</p>

            <span>450+ Properties</span>

          </div>

        </div>


        {/* PG & Hostels */}
        <div className="category-card">

          <div className="category-image">
            <img
              src="https://cdn.sanity.io/images/y527plhk/production/736b3a72ba9b2a18e243ef695c0870abd83bca6c-4000x3000.jpg"
              alt="PG and Hostels"
            />
          </div>

          <div className="category-content">

            <div className="category-icon">
              👥
            </div>

            <h3>PG & Hostels</h3>

            <p>Comfortable PGs</p>

            <span>800+ Properties</span>

          </div>

        </div>


        {/* Rental Homes */}
        <div className="category-card">

          <div className="category-image">
            <img
              src="https://fruitbasket.limepack.com/blog/wp-content/uploads/2024/04/luxury-modern-hotel-bedroom-suite.jpg"
              alt="Rental Homes"
            />
          </div>

          <div className="category-content">

            <div className="category-icon">
              🏠
            </div>

            <h3>Rental Homes</h3>

            <p>Homes for rent</p>

            <span>950+ Properties</span>

          </div>

        </div>

      </div>

    </section>
  );
}

export default PropertyCategories;