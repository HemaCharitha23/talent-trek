import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiTrash2 } from "react-icons/fi";
import VehicleImage from "./VehicleImage";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/format";
import "../styles/Cart.css";

function Cart() {
  const { items, cartCount, totalPrice, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <FiShoppingCart size={72} />
        <h2>Your cart is empty!</h2>
        <p>Browse our pre-owned vehicles and add your favourites here.</p>
        <Link to="/shop" className="btn btn-accent">
          Explore Vehicles
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-heading">
        <h1>Your Shopping Cart</h1>
        <button className="btn-link" onClick={clearCart}>
          <FiTrash2 /> Clear Cart
        </button>
      </div>

      <div className="cart-list">
        {items.map((item) => (
          <div key={item._id} className="cart-item">
            <VehicleImage vehicle={item} className="cart-item-image" />

            <div className="cart-item-info">
              <h3>{item.name}</h3>
              <p>
                {item.brand} · {item.model}
              </p>
              <p>Year: {item.manufacturingYear}</p>
              <p className="cart-item-price">{formatPrice(item.price)}</p>
            </div>

            <div className="cart-item-actions">
              <Link to={`/vehicles/${item._id}`} className="btn btn-outline">
                View Details
              </Link>
              <button className="btn btn-danger" onClick={() => removeFromCart(item._id)}>
                Remove from Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="cart-summary-row">
          <span>Total vehicles</span>
          <strong>{cartCount}</strong>
        </div>
        <div className="cart-summary-row total">
          <span>Total price</span>
          <strong>{formatPrice(totalPrice)}</strong>
        </div>

        <div className="cart-summary-actions">
          <Link to="/shop" className="btn btn-outline">
            Continue Shopping
          </Link>
          <button className="btn btn-accent" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;