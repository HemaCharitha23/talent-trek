import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Toast from "../components/Toast";
import useToast from "../hooks/useToast";

const CART_KEY = "talentTrekCart";
const BUY_NOW_KEY = "talentTrekBuyNow";

const CartContext = createContext(null);

// Keep only the fields the cart and checkout need
function toCartItem(vehicle) {
  return {
    _id: vehicle._id,
    name: vehicle.name,
    brand: vehicle.brand,
    model: vehicle.model,
    category: vehicle.category,
    manufacturingYear: vehicle.manufacturingYear,
    price: Number(vehicle.price),
    location: vehicle.location,
    images: vehicle.images || [],
  };
}

function isValidItem(item) {
  return (
    item &&
    typeof item === "object" &&
    typeof item._id === "string" &&
    typeof item.name === "string" &&
    Number.isFinite(Number(item.price))
  );
}

// Safely read the cart from localStorage (handles missing or broken data)
function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const seen = new Set();
    const valid = [];
    parsed.forEach((item) => {
      if (isValidItem(item) && !seen.has(item._id)) {
        seen.add(item._id);
        valid.push({ ...item, price: Number(item.price) });
      }
    });
    return valid;
  } catch (error) {
    return [];
  }
}

function loadBuyNow() {
  try {
    const raw = sessionStorage.getItem(BUY_NOW_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isValidItem(parsed) ? { ...parsed, price: Number(parsed.price) } : null;
  } catch (error) {
    return null;
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);
  const [buyNowItem, setBuyNowItem] = useState(loadBuyNow);
  const { toast, showToast, hideToast } = useToast();

  // Save the cart whenever it changes
  useEffect(() => {
    try {
      if (items.length === 0) {
        localStorage.removeItem(CART_KEY);
      } else {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      }
    } catch (error) {
      console.error("Could not save the cart:", error);
    }
  }, [items]);

  // Save the Buy Now vehicle separately from the cart
  useEffect(() => {
    try {
      if (buyNowItem) {
        sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify(buyNowItem));
      } else {
        sessionStorage.removeItem(BUY_NOW_KEY);
      }
    } catch (error) {
      console.error("Could not save the Buy Now vehicle:", error);
    }
  }, [buyNowItem]);

  const isInCart = useCallback(
    (id) => items.some((item) => item._id === id),
    [items]
  );

  const addToCart = useCallback(
    (vehicle) => {
      if (vehicle.status && vehicle.status !== "available") {
        showToast("Sorry, this vehicle is no longer available.", "error");
        return false;
      }
      if (items.some((item) => item._id === vehicle._id)) {
        showToast("This vehicle is already in your cart.", "error");
        return false;
      }
      setItems((prev) => [...prev, toCartItem(vehicle)]);
      showToast("Vehicle added to cart!", "success");
      return true;
    },
    [items, showToast]
  );

  const removeFromCart = useCallback(
    (id, { silent = false } = {}) => {
      setItems((prev) => prev.filter((item) => item._id !== id));
      if (!silent) showToast("Vehicle removed from cart.", "info");
    },
    [showToast]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    showToast("Cart cleared.", "info");
  }, [showToast]);

  // Buy Now: does not touch the cart
  const buyNow = useCallback(
    (vehicle) => {
      if (vehicle.status && vehicle.status !== "available") {
        showToast("Sorry, this vehicle is no longer available.", "error");
        return false;
      }
      setBuyNowItem(toCartItem(vehicle));
      return true;
    },
    [showToast]
  );

  const clearBuyNow = useCallback(() => setBuyNowItem(null), []);

  const cartCount = items.length; // unique vehicles
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );

  const value = {
    items,
    cartCount,
    totalPrice,
    isInCart,
    addToCart,
    removeFromCart,
    clearCart,
    buyNowItem,
    buyNow,
    clearBuyNow,
    showToast,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <Toast toast={toast} onClose={hideToast} />
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside a CartProvider.");
  }
  return context;
}