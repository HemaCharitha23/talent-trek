import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SearchFilter, { initialFilters } from "../components/SearchFilter";
import VehicleList from "../components/VehicleList";
import Loader from "../components/Loader";
import { useCart } from "../context/CartContext";
import { fetchVehicles } from "../services/vehicleService";
import "../styles/Shop.css";

function Shop() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingSample, setUsingSample] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const { addToCart, buyNow } = useCart();
  const navigate = useNavigate();

  // Load vehicles once when the page opens
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const result = await fetchVehicles();
      if (cancelled) return;
      setVehicles(result.vehicles);
      setUsingSample(result.usingSample);
      setLoadError(result.error);
      setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Options for the dropdown filters come from the loaded vehicles
  const years = useMemo(
    () => [...new Set(vehicles.map((v) => v.manufacturingYear))].sort((a, b) => b - a),
    [vehicles]
  );
  const fuelTypes = useMemo(
    () => [...new Set(vehicles.map((v) => v.fuelType))].sort(),
    [vehicles]
  );
  const locations = useMemo(
    () => [...new Set(vehicles.map((v) => v.location))].sort(),
    [vehicles]
  );

  // Apply all filters together, then sort
  const filteredVehicles = useMemo(() => {
    const term = filters.search.trim().toLowerCase();
    const min = filters.minPrice === "" ? null : Number(filters.minPrice);
    const max = filters.maxPrice === "" ? null : Number(filters.maxPrice);

    const result = vehicles.filter((v) => {
      if (v.status && v.status !== "available") return false;

      if (term) {
        const text = `${v.name} ${v.brand} ${v.model}`.toLowerCase();
        if (!text.includes(term)) return false;
      }
      if (filters.category && v.category !== filters.category) return false;
      if (min !== null && v.price < min) return false;
      if (max !== null && v.price > max) return false;
      if (filters.year && String(v.manufacturingYear) !== filters.year) return false;
      if (filters.fuelType && v.fuelType !== filters.fuelType) return false;
      if (filters.location && v.location !== filters.location) return false;
      return true;
    });

    const sorted = [...result];
    if (filters.sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    else if (filters.sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    else sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return sorted;
  }, [vehicles, filters]);

  const handleAddToCart = (vehicle) => {
    addToCart(vehicle); // stays on the Shop page, shows a toast
  };

  const handleBuyNow = (vehicle) => {
    if (buyNow(vehicle)) {
      navigate("/checkout?mode=buynow");
    }
  };

  return (
    <div className="shop">
      <div className="shop-header">
        <h1>Shop Pre-Owned Vehicles</h1>
        <p>Search, filter and compare cars, bikes, scooties and lorries.</p>
      </div>

      {loading ? (
        <Loader text="Loading vehicles..." />
      ) : (
        <>
                    {usingSample && (
            <div className="alert warning">
              <strong>Showing sample vehicles.</strong> {loadError} Start the backend
              and check your MongoDB connection to see real listings.
            </div>
          )}

          {!usingSample && vehicles.length === 0 && (
            <div className="alert warning">
              The database has no vehicles yet. Add one using the form on the Home page,
              or run <code>npm run seed</code> in the backend folder.
            </div>
          )}

          <SearchFilter
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(initialFilters)}
            years={years}
            fuelTypes={fuelTypes}
            locations={locations}
          />

          <p className="result-count">
            Showing {filteredVehicles.length} of {vehicles.length} vehicles
          </p>

          <VehicleList
            vehicles={filteredVehicles}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </>
      )}
    </div>
  );
}

export default Shop;