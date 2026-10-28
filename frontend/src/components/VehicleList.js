import VehicleCard from "./VehicleCard";

function VehicleList({ vehicles, onAddToCart, onBuyNow }) {
  if (vehicles.length === 0) {
    return (
      <div className="no-results">
        <h3>No vehicles match your search.</h3>
        <p>Try changing or clearing your filters.</p>
      </div>
    );
  }

  return (
    <div className="vehicle-grid">
      {vehicles.map((vehicle) => (
        <VehicleCard
          key={vehicle._id}
          vehicle={vehicle}
          onAddToCart={onAddToCart}
          onBuyNow={onBuyNow}
        />
      ))}
    </div>
  );
}

export default VehicleList;