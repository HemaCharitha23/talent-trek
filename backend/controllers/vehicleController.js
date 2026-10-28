const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const asyncHandler = require("../middleware/asyncHandler");

// Only these fields are accepted from the client
const ALLOWED_FIELDS = [
  "name",
  "brand",
  "model",
  "category",
  "manufacturingYear",
  "price",
  "fuelType",
  "transmission",
  "kilometersDriven",
  "condition",
  "location",
  "description",
  "contactNumber",
  "images",
  "specs",
];

function pickFields(body, extraFields = []) {
  const data = {};
  [...ALLOWED_FIELDS, ...extraFields].forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });
  return data;
}

// GET /api/vehicles
const getVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find().sort({ createdAt: -1 }).lean();
  res.json(vehicles);
});

// GET /api/vehicles/:id
const getVehicleById = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: "Vehicle not found." });
  }
  const vehicle = await Vehicle.findById(req.params.id).lean();
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found." });
  }
  res.json(vehicle);
});

// POST /api/vehicles
const createVehicle = asyncHandler(async (req, res) => {
  const data = pickFields(req.body);
  data.status = "available"; // new listings always start as available
  const vehicle = await Vehicle.create(data);
  res.status(201).json(vehicle);
});

// PUT /api/vehicles/:id
const updateVehicle = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: "Vehicle not found." });
  }
  const data = pickFields(req.body, ["status"]);
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "No valid fields were provided to update." });
  }
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found." });
  }
  res.json(vehicle);
});

// DELETE /api/vehicles/:id
const deleteVehicle = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(404).json({ message: "Vehicle not found." });
  }
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
  if (!vehicle) {
    return res.status(404).json({ message: "Vehicle not found." });
  }
  res.json({ message: "Vehicle deleted." });
});

module.exports = {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};