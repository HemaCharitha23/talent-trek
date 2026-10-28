import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h3>Talent Trek</h3>
          <p>Discover and compare quality pre-owned vehicles.</p>
        </div>
        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>
      <p className="footer-copy">
        © {new Date().getFullYear()} Talent Trek. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;