import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";
import Loader from "../components/Loader";
import { getOrder } from "../services/api";
import { formatPrice } from "../utils/format";
import "../styles/Checkout.css";

function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    getOrder(id)
      .then((res) => {
        if (!cancelled) setOrder(res.data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.response?.status === 404) setError("We could not find that order.");
        else setError("Could not load the order. Please check that the backend is running.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Loader text="Loading your order..." />;

  if (error) {
    return (
      <div className="details-error">
        <h2>{error}</h2>
        <Link to="/shop" className="btn btn-primary">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="confirmation">
      <div className="confirmation-card">
        <FiCheckCircle size={64} className="confirmation-icon" />
        <h1>Order Placed!</h1>
        <p>Thank you, {order.customer.name}. Your order request has been recorded.</p>

        <div className="order-id-box">
          <span>Order ID</span>
          <strong>{order.orderId}</strong>
        </div>
        <p className="payment-note">
          Please save your Order ID. No payment has been taken on this site, so your
          payment status is shown as <strong>{order.paymentStatus}</strong>.
        </p>

        <div className="confirmation-items">
          {order.items.map((item) => (
            <div key={item.vehicle} className="confirmation-item">
              <span>
                {item.name}
                <small>
                  {" "}
                  ({item.brand} {item.model})
                </small>
              </span>
              <strong>{formatPrice(item.price)}</strong>
            </div>
          ))}
          <div className="confirmation-item total">
            <span>Total</span>
            <strong>{formatPrice(order.totalAmount)}</strong>
          </div>
        </div>

        <div className="confirmation-address">
          <h3>Contact and delivery details</h3>
          <p>{order.customer.email} · {order.customer.phone}</p>
          <p>
            {order.customer.address}, {order.customer.city}, {order.customer.state} -{" "}
            {order.customer.pincode}
          </p>
        </div>

        <div className="confirmation-actions">
          <Link to="/shop" className="btn btn-accent">Continue Shopping</Link>
          <Link to="/" className="btn btn-outline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;