import { getVehicles, getVehicleById } from "./api";
import sampleVehicles from "../data/sampleVehicles";

// Tries the backend first. If it fails, falls back to sample data
// and tells the page so it can show a visible warning.
export async function fetchVehicles() {
  try {
    const res = await getVehicles();
    const list = Array.isArray(res.data) ? res.data : res.data.vehicles;
    if (!Array.isArray(list)) {
      throw new Error("Unexpected response from the server.");
    }
    return { vehicles: list, usingSample: false, error: "" };
  } catch (err) {
    return {
      vehicles: sampleVehicles,
      usingSample: true,
      error: err.response?.data?.message || "Could not reach the backend server.",
    };
  }
}

export async function fetchVehicleById(id) {
  if (id.startsWith("sample-")) {
    const vehicle = sampleVehicles.find((v) => v._id === id);
    if (!vehicle) throw new Error("Vehicle not found.");
    return { vehicle, usingSample: true };
  }

  try {
    const res = await getVehicleById(id);
    return { vehicle: res.data, usingSample: false };
  } catch (err) {
    if (err.response?.status === 404) throw new Error("Vehicle not found.");
    throw new Error("Could not load this vehicle from the server.");
  }
}