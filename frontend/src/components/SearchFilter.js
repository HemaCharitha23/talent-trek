import { FiSearch } from "react-icons/fi";
import "../styles/Shop.css";

export const initialFilters = {
  search: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  year: "",
  fuelType: "",
  location: "",
  sort: "newest",
};

const categories = ["Cars", "Bikes", "Scooties", "Lorries"];

function SearchFilter({ filters, onChange, onClear, years, fuelTypes, locations }) {
  const handleChange = (e) => {
    onChange({ ...filters, [e.target.name]: e.target.value });
  };

  const priceRangeInvalid =
    filters.minPrice !== "" &&
    filters.maxPrice !== "" &&
    Number(filters.minPrice) > Number(filters.maxPrice);

  return (
    <section className="filters">
      <div className="search-box">
        <FiSearch />
        <input
          type="text"
          name="search"
          placeholder="Search by vehicle name, brand or model..."
          value={filters.search}
          onChange={handleChange}
        />
      </div>

      <div className="category-tabs">
        <button
          className={filters.category === "" ? "tab active" : "tab"}
          onClick={() => onChange({ ...filters, category: "" })}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={filters.category === cat ? "tab active" : "tab"}
            onClick={() => onChange({ ...filters, category: cat })}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="filter-grid">
        <div className="filter-field">
          <label htmlFor="minPrice">Min Price (₹)</label>
          <input
            id="minPrice"
            type="number"
            name="minPrice"
            min="0"
            value={filters.minPrice}
            onChange={handleChange}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="maxPrice">Max Price (₹)</label>
          <input
            id="maxPrice"
            type="number"
            name="maxPrice"
            min="0"
            value={filters.maxPrice}
            onChange={handleChange}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="year">Manufacturing Year</label>
          <select id="year" name="year" value={filters.year} onChange={handleChange}>
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="fuelType">Fuel Type</label>
          <select id="fuelType" name="fuelType" value={filters.fuelType} onChange={handleChange}>
            <option value="">All fuel types</option>
            {fuelTypes.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="location">Location</label>
          <select id="location" name="location" value={filters.location} onChange={handleChange}>
            <option value="">All locations</option>
            {locations.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="filter-field">
          <label htmlFor="sort">Sort By</label>
          <select id="sort" name="sort" value={filters.sort} onChange={handleChange}>
            <option value="newest">Newest listings</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {priceRangeInvalid && (
        <p className="error-text">Minimum price is higher than maximum price.</p>
      )}

      <button className="btn btn-outline" onClick={onClear}>
        Clear Filters
      </button>
    </section>
  );
}

export default SearchFilter;