import "./SearchBar.css";

function SearchBar() {
    return (

        <div className="search-box">

            <div className="search-item">

                <label>📍Location</label>
                <input 
                type="text"
                placeholder="Enter city or location"
                />

            </div>

            <div className="search-item">

                <label>Property Type</label>
                <select>
                    <option>All Types</option>
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>PG</option>
                    <option>House</option>
                </select>

            </div>

            <div className="search-item">

                <label>Price Range</label>
                <select>
                    <option>Any Price</option>
                    <option>₹5,000 - ₹10,000</option>
                    <option>₹10,000 - ₹20,000</option>
                    <option>₹20,000+</option>
                </select>

            </div>

            <div className="search-box-btn">
                <div className="search-btn">
                    🔍Search
                </div>
            </div>

        </div>
    )
}
export default SearchBar;