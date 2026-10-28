const categories = ["Cars", "Bikes", "Scooties", "Lorries"];

function VehicleDropdown({ selected, onChange }) {
  return (
    <div className="dropdown-section">
      <label htmlFor="vehicle-type">Select Your Vehicle Type</label>
      <select
        id="vehicle-type"
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">-- Choose a category --</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

export default VehicleDropdown;