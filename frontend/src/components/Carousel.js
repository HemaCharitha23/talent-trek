import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../styles/Home.css";

const slides = [
  { id: 1, label: "Cars", image: "https://img.magnific.com/free-psd/modern-family-car-image-without-background_530521-1820.jpg?semt=ais_hybrid&w=740&q=80", gradient: "linear-gradient(135deg, #0f172a, #1d4ed8)" },
  { id: 2, label: "Bikes", image: "https://www.carandbike.com/_next/image?url=https%3A%2F%2Fimages.carandbike.com%2Fbike-images%2Flarge%2Fbmw%2Fs-1000-rr%2Fbmw-s-1000-rr.jpg%3Fv%3D18&w=1920&q=75", gradient: "linear-gradient(135deg, #1f2937, #dc2626)" },
  { id: 3, label: "Scooties", image: "https://img.magnific.com/free-photo/cool-motorcycle-studio_23-2150781724.jpg?semt=ais_hybrid&w=740&q=80", gradient: "linear-gradient(135deg, #064e3b, #0d9488)" },
  { id: 4, label: "Lorries", image: "https://img.magnific.com/premium-vector/truck-cargo-lorry-vector_1306769-1186.jpg?semt=ais_hybrid&w=740&q=80", gradient: "linear-gradient(135deg, #3b0764, #ea580c)" },
];

function Carousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = () => {
    setCurrent((p) => (p - 1 + slides.length) % slides.length);
  };

  // Automatic sliding every 4 seconds (pauses while hovering)
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [paused, next]);

  return (
    <section
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`carousel-slide ${index === current ? "active" : ""}`}
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url(${slide.image}), ${slide.gradient}`,
          }}
          aria-hidden={index !== current}
        />
      ))}

      <div className="carousel-content">
        <h1>Find Your Perfect Ride with Talent Trek</h1>
        <p>Discover quality pre-owned vehicles at prices you'll love.</p>
        <button className="btn btn-accent" onClick={() => navigate("/shop")}>
          Explore Vehicles
        </button>
      </div>

      <button className="carousel-arrow left" onClick={prev} aria-label="Previous slide">
        <FiChevronLeft size={28} />
      </button>
      <button className="carousel-arrow right" onClick={next} aria-label="Next slide">
        <FiChevronRight size={28} />
      </button>

      <div className="carousel-dots">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            className={`dot ${index === current ? "active" : ""}`}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Carousel;