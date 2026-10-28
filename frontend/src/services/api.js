import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 8000,
});

// Vehicles
export const getVehicles = () => api.get("/vehicles");
export const getVehicleById = (id) => api.get(`/vehicles/${id}`);
export const createVehicle = (vehicleData) => api.post("/vehicles", vehicleData);

// Orders
export const createOrder = (orderData) => api.post("/orders", orderData);
export const getOrder = (id) => api.get(`/orders/${id}`);

// Contact
export const sendContactMessage = (data) => api.post("/contact", data);

export default api;