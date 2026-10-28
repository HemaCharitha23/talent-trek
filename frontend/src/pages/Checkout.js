import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import VehicleImage from "../components/VehicleImage";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";
import { formatPrice } from "../utils/format";
import "../styles/Cart.css";
import "../styles/Checkout.css";

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",
];

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items, buyNowItem, removeFromCart, clearBuyNow, showToast } = useCart();

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [unavailableIds, setUnavailableIds] = useState([]);

  const isBuyNow = searchParams.get("mode") === "buynow";
  const orderItems = isBuyNow ? (buyNowItem ? [buyNowItem] : []) : items;
  const total = orderItems.reduce((sum, item) => sum + item.price, 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (formData.name.trim().length < 2) newErrors.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim()))
      newErrors.email = "Enter a valid email address.";
    if (!/^[6-9]\d{9}$/.test(formData.phone.trim()))
      newErrors.phone = "Enter a valid 10-digit mobile number.";
    if (formData.address.trim().length < 5) newErrors.address = "Enter your full address.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.state) newErrors.state = "Select your state.";
    if (!/^[1-9]\d{5}$/.test(formData.pincode.trim()))
      newErrors.pincode = "Enter a valid 6-digit PIN code.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setUnavailableIds([]);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const customer = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state,
        pincode: formData.pincode.trim(),
      };

      // Only vehicle ids are sent. The server looks up the real prices.
      const response = await createOrder({
        customer,
        vehicleIds: orderItems.map((item) => item._id),
      });
      const order = response.data;

      // The order succeeded, so now (and only now) remove the purchased vehicles
      orderItems.forEach((item) => removeFromCart(item._id, { silent: true }));
      if (isBuyNow) clearBuyNow();

      navigate(`/order/${order.orderId}`, { replace: true });
    } catch (err) {
      if (err.response?.status === 409) {
        setServerError(err.response.data.message);
        setUnavailableIds(err.response.data.unavailableIds || []);
      } else if (err.response) {
        setServerError(err.response.data?.message || "The order could not be placed.");
      } else {
        setServerError(
          "Could not reach the server. Please check that the backend is running. Your cart has not been changed."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const removeUnavailable = () => {
    unavailableIds.forEach((id) => removeFromCart(id, { silent: true }));
    if (isBuyNow && buyNowItem && unavailableIds.includes(buyNowItem._id)) {
      clearBuyNow();
    }
    setUnavailableIds([]);
    setServerError("");
    showToast("Unavailable vehicles were removed.", "info");
  };

  if (orderItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Nothing to check out yet.</h2>
        <p>Add a vehicle to your cart or choose Buy Now on a vehicle.</p>
        <Link to="/shop" className="btn btn-accent">
          Explore Vehicles
        </Link>
      </div>
    );
  }

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

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <p className="checkout-mode">
        {isBuyNow
          ? "Buy Now: this single vehicle only. Your cart is not affected unless this vehicle is in it."
          : "Review your vehicles and enter your details."}
      </p>

      <div className="checkout-layout">
        <form className="form-card" onSubmit={handleSubmit} noValidate>
          <h2>Your Details</h2>

          <div className="checkout-grid">
            {field("name", "Full Name", "text", { autoComplete: "name" })}
            {field("email", "Email", "email", { autoComplete: "email" })}
            {field("phone", "Phone Number", "tel", { maxLength: 10, autoComplete: "tel" })}
            {field("city", "City", "text", { autoComplete: "address-level2" })}

            <div className="form-group full-width">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? "invalid" : ""}
              />
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="state">State</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={errors.state ? "invalid" : ""}
              >
                <option value="">-- Select --</option>
                {indianStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.state && <span className="error-text">{errors.state}</span>}
            </div>

            {field("pincode", "PIN Code", "text", { maxLength: 6, inputMode: "numeric" })}
          </div>

          {serverError && (
            <div className="alert error">
              <p>{serverError}</p>
              {unavailableIds.length > 0 && (
                <button type="button" className="btn btn-outline" onClick={removeUnavailable}>
                  Remove unavailable vehicles
                </button>
              )}
            </div>
          )}

          <button type="submit" className="btn btn-accent btn-block" disabled={submitting}>
            {submitting ? "Placing order..." : "Confirm Order"}
          </button>
          <p className="payment-note">
            No payment is taken on this site. Confirming places an order request only.
          </p>
        </form>

        <aside className="order-summary">
          <h2>Order Summary</h2>

          <div className="summary-items">
            {orderItems.map((item) => (
              <div key={item._id} className="summary-item">
                <VehicleImage vehicle={item} className="summary-image" />
                <div>
                  <h4>{item.name}</h4>
                  <p>
                    {item.brand} · {item.model} · {item.manufacturingYear}
                  </p>
                  <strong>{formatPrice(item.price)}</strong>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary-row">
            <span>Total vehicles</span>
            <strong>{orderItems.length}</strong>
          </div>
          <div className="cart-summary-row total">
            <span>Total amount</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <p className="payment-note">
            The final price is confirmed by the server when you place the order.
          </p>

          <Link to={isBuyNow ? "/shop" : "/cart"} className="btn btn-outline btn-block">
            {isBuyNow ? "Back to Shop" : "Back to Cart"}
          </Link>
        </aside>
      </div>
    </div>
  );
}

export default Checkout;