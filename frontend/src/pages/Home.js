import { useState } from "react";
import Carousel from "../components/Carousel";
import VehicleDropdown from "../components/VehicleDropdown";
import VehicleForm from "../components/VehicleForm";
import "../styles/Home.css";

function Home() {
  const [category, setCategory] = useState("");

  return (
    <div className="home">
      <Carousel />
      <VehicleDropdown selected={category} onChange={setCategory} />
      {category && (
        // key resets the form when the category changes
        <VehicleForm key={category} category={category} />
      )}
    </div>
  );
}

export default Home;