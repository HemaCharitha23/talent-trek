import { Link } from "react-router-dom";
import { FiSearch, FiList, FiShoppingCart } from "react-icons/fi";
import "../styles/About.css";

function About() {
  return (
    <div className="about">
      <section className="about-hero">
        <h1>About Talent Trek</h1>
        <p>
          Talent Trek is a marketplace for discovering and comparing pre-owned vehicles.
          Whether you are looking for a family car, a daily-commute bike, a scooty or a
          commercial lorry, you can browse listings in one place and compare them side by side.
        </p>
      </section>

      <section className="about-cards">
        <div className="about-card">
          <FiSearch size={32} />
          <h3>Discover</h3>
          <p>
            Search by name or brand, then narrow results by category, price, year, fuel
            type and location.
          </p>
        </div>
        <div className="about-card">
          <FiList size={32} />
          <h3>Compare</h3>
          <p>
            Each vehicle shows its year, kilometers driven, condition, price and full
            specifications so you can weigh your options.
          </p>
        </div>
        <div className="about-card">
          <FiShoppingCart size={32} />
          <h3>Choose</h3>
          <p>
            Save vehicles to your cart, or use Buy Now to order one directly. Every
            second-hand vehicle is a single unique vehicle, so each can be sold only once.
          </p>
        </div>
      </section>

      <section className="about-note">
        <h2>Buy with confidence</h2>
        <p>
          Listing details are provided by sellers. We recommend viewing and test-driving
          any vehicle, and checking its documents and service history, before you complete
          a purchase.
        </p>
        <Link to="/shop" className="btn btn-accent">
          Explore Vehicles
        </Link>
      </section>
    </div>
  );
}

export default About;