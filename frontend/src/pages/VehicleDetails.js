import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiPhone } from "react-icons/fi";
import VehicleImage from "../components/VehicleImage";
import Loader from "../components/Loader";
import { useCart } from "../context/CartContext";
import { fetchVehicleById } from "../services/vehicleService";
import { formatPrice, formatKm } from "../utils/format";
import "../styles/VehicleDetails.css";

function VehicleDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart();
  const [vehicle, setVehicle] = useState(null);
  const [usingSample, setUsingSample] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetchVehicleById(id)
      .then((result) => {
        if (cancelled) return;
        setVehicle(result.vehicle);
        setUsingSample(result.usingSample);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Loader text="Loading vehicle..." />;

  if (error) {
    return (
      <div className="details-error">
        <h2>{error}</h2>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  const handleBuyNow = () => {
    if (buyNow(vehicle)) {
      navigate("/checkout?mode=buynow");
    }
  };

  const specs = [
    ["Category", vehicle.category],
    ["Brand", vehicle.brand],
    ["Model", vehicle.model],
    ["Manufacturing Year", vehicle.manufacturingYear],
    ["Fuel Type", vehicle.fuelType],
    ["Transmission", vehicle.transmission],
    ["Kilometers Driven", formatKm(vehicle.kilometersDriven)],
    ["Condition", vehicle.condition],
    ...Object.entries(vehicle.specs || {}),
  ].filter(([, value]) => value);

  return (
    <div className="details">
      <Link to="/shop" className="back-link">
        <FiArrowLeft /> Back to Shop
      </Link>

      {usingSample && (
        <div className="alert warning">This is a sample vehicle, not a real listing.</div>
      )}

      <div className="details-layout">
        <VehicleImage vehicle={vehicle} className="details-image" />

        <div className="details-info">
          <span className="vehicle-tag">{vehicle.category}</span>
          <h1>{vehicle.name}</h1>
          <p className="details-price">{formatPrice(vehicle.price)}</p>

          <p className="details-location">
            <FiMapPin /> {vehicle.location}
          </p>

          <p className="details-desc">{vehicle.description}</p>

          <div className="details-seller">
            <FiPhone />
            {vehicle.contactNumber ? (
              <span>
                Seller contact:{" "}
                <a href={`tel:${vehicle.contactNumber}`}>{vehicle.contactNumber}</a>
              </span>
            ) : (
              <span>Seller contact not available</span>
            )}
          </div>

          <div className="details-actions">
            <button className="btn btn-primary" onClick={() => addToCart(vehicle)}>
              Add to Cart
            </button>
            <button className="btn btn-accent" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <section className="specs">
        <h2>Specifications</h2>
        <table>
          <tbody>
            {specs.map(([label, value]) => (
              <tr key={label}>
                <th>{label}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default VehicleDetails;