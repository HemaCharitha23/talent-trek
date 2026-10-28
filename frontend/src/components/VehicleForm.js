import { useState } from "react";
import { createVehicle } from "../services/api";

const fuelOptions = {
  Cars: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
  Bikes: ["Petrol", "Electric"],
  Scooties: ["Petrol", "Electric"],
  Lorries: ["Diesel", "CNG", "Electric"],
};

// Bikes and scooties don't need a transmission field in this form
const showTransmission = (category) => category === "Cars" || category === "Lorries";

const emptyForm = {
  name: "",
  brand: "",
  model: "",
  manufacturingYear: "",
  price: "",
  fuelType: "",
  transmission: "",
  kilometersDriven: "",
  condition: "",
  location: "",
  description: "",
  contactNumber: "",
};

function VehicleForm({ category }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.name.trim()) newErrors.name = "Vehicle name is required.";
    if (!formData.brand.trim()) newErrors.brand = "Brand is required.";
    if (!formData.model.trim()) newErrors.model = "Model is required.";

    const year = Number(formData.manufacturingYear);
    if (!formData.manufacturingYear) newErrors.manufacturingYear = "Year is required.";
    else if (!Number.isInteger(year) || year < 1980 || year > currentYear)
      newErrors.manufacturingYear = `Enter a year between 1980 and ${currentYear}.`;

    if (!formData.price) newErrors.price = "Price is required.";
    else if (Number(formData.price) <= 0) newErrors.price = "Price must be greater than 0.";

    if (!formData.fuelType) newErrors.fuelType = "Select a fuel type.";
    if (showTransmission(category) && !formData.transmission)
      newErrors.transmission = "Select a transmission.";

    if (formData.kilometersDriven === "") newErrors.kilometersDriven = "Kilometers driven is required.";
    else if (Number(formData.kilometersDriven) < 0)
      newErrors.kilometersDriven = "Cannot be negative.";

    if (!formData.condition) newErrors.condition = "Select a condition.";
    if (!formData.location.trim()) newErrors.location = "Location is required.";

    if (formData.description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters.";

    if (!/^[6-9]\d{9}$/.test(formData.contactNumber))
      newErrors.contactNumber = "Enter a valid 10-digit Indian mobile number.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        category,
        manufacturingYear: Number(formData.manufacturingYear),
        price: Number(formData.price),
        fuelType: formData.fuelType,
        transmission: showTransmission(category) ? formData.transmission : undefined,
        kilometersDriven: Number(formData.kilometersDriven),
        condition: formData.condition,
        location: formData.location.trim(),
        description: formData.description.trim(),
        contactNumber: formData.contactNumber,
        status: "available",
      };
      await createVehicle(payload);
      setStatus({ type: "success", message: "Your vehicle listing was saved successfully!" });
      setFormData(emptyForm);
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      setStatus({
        type: "error",
        message: serverMessage
          ? serverMessage
          : "Could not save the listing. The backend server may not be running yet (it is built in Phase 4).",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const field = (name, label, type = "text", extra = {}) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        className={errors[name] ? "invalid" : ""}
        {...extra}
      />
      {errors[name] && <span className="error-text">{errors[name]}</span>}
    </div>
  );

  const select = (name, label, options) => (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className={errors[name] ? "invalid" : ""}
      >
        <option value="">-- Select --</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      {errors[name] && <span className="error-text">{errors[name]}</span>}
    </div>
  );

  return (
    <form className="vehicle-form" onSubmit={handleSubmit} noValidate>
      <h2>List Your {category.slice(0, -1) === "Scootie" ? "Scooty" : category.slice(0, -1)} for Sale</h2>

      <div className="form-grid">
        {field("name", "Vehicle Name", "text", { placeholder: "e.g. Maruti Suzuki Swift VXi" })}
        {field("brand", "Brand")}
        {field("model", "Model")}
        {field("manufacturingYear", "Manufacturing Year", "number", { placeholder: "e.g. 2019" })}
        {field("price", "Price (₹)", "number", { placeholder: "e.g. 450000" })}
        {select("fuelType", "Fuel Type", fuelOptions[category])}
        {showTransmission(category) && select("transmission", "Transmission", ["Manual", "Automatic"])}
        {field("kilometersDriven", "Kilometers Driven", "number")}
        {select("condition", "Vehicle Condition", ["Excellent", "Good", "Fair"])}
        {field("location", "Location", "text", { placeholder: "e.g. Hyderabad" })}
        {field("contactNumber", "Contact Number", "tel", { placeholder: "10-digit mobile", maxLength: 10 })}

        <div className="form-group full-width">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? "invalid" : ""}
          />
          {errors.description && <span className="error-text">{errors.description}</span>}
        </div>
      </div>

      {status.message && (
        <div className={`alert ${status.type}`}>{status.message}</div>
      )}

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Saving..." : "Submit Listing"}
      </button>
    </form>
  );
}

export default VehicleForm;