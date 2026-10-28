import { useState } from "react";
import { FaCar, FaMotorcycle, FaTruck } from "react-icons/fa";

const icons = {
  Cars: FaCar,
  Bikes: FaMotorcycle,
  Scooties: FaMotorcycle,
  Lorries: FaTruck,
};

function VehicleImage({ vehicle, className = "" }) {
  const [failed, setFailed] = useState(false);
  const src = vehicle.images && vehicle.images[0];

  if (src && !failed) {
    return (
      <img
        className={`vehicle-image ${className}`}
        src={src}
        alt={vehicle.name}
        onError={() => setFailed(true)}
      />
    );
  }

  const Icon = icons[vehicle.category] || FaCar;
  const categoryClass = (vehicle.category || "cars").toLowerCase();

  return (
    <div className={`vehicle-image placeholder cat-${categoryClass} ${className}`}>
      <Icon size={56} />
      <span>{vehicle.brand}</span>
    </div>
  );
}

export default VehicleImage;