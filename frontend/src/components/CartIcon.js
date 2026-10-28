import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { useCart } from "../context/CartContext";

function CartIcon() {
  const { cartCount } = useCart();

  return (
    <Link
      to="/cart"
      className="cart-icon"
      aria-label={`Open shopping cart, ${cartCount} vehicles`}
    >
      <FiShoppingCart size={24} />
      {cartCount > 0 && (
        // key makes the badge replay its pop animation whenever the count changes
        <span key={cartCount} className="cart-badge">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );
}

export default CartIcon;