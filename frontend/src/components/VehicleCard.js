import { Link } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import VehicleImage from "./VehicleImage";
import { formatPrice, formatKm } from "../utils/format";
import "../styles/VehicleCard.css";

function VehicleCard({ vehicle, onAddToCart, onBuyNow }) {
  return (
    <article className="vehicle-card">
      <VehicleImage vehicle={vehicle} />

      <div className="vehicle-card-body">
        <span className="vehicle-tag">{vehicle.category}</span>
        <h3>{vehicle.name}</h3>
        <p className="vehicle-sub">
          {vehicle.brand} · {vehicle.model} · {vehicle.manufacturingYear}
        </p>

        <p className="vehicle-price">{formatPrice(vehicle.price)}</p>

        <ul className="vehicle-meta">
          <li>{formatKm(vehicle.kilometersDriven)}</li>
          <li>{vehicle.fuelType}</li>
          <li>{vehicle.condition}</li>
        </ul>

        <p className="vehicle-location">
          <FiMapPin /> {vehicle.location}
        </p>

        <p className="vehicle-desc">{vehicle.description}</p>

        <div className="vehicle-actions">
          <Link to={`/vehicles/${vehicle._id}`} className="btn btn-outline btn-block">
            View Details
          </Link>
          <div className="vehicle-actions-row">
            <button className="btn btn-primary" onClick={() => onAddToCart(vehicle)}>
              Add to Cart
            </button>
            <button className="btn btn-accent" onClick={() => onBuyNow(vehicle)}>
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default VehicleCard;