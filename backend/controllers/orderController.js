const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const Order = require("../models/Order");
const asyncHandler = require("../middleware/asyncHandler");

function validateCustomer(customer) {
  const errors = [];
  const c = customer || {};
  const text = (value) => (typeof value === "string" ? value.trim() : "");

  if (text(c.name).length < 2) errors.push("Name is required.");
  if (!/^\S+@\S+\.\S+$/.test(text(c.email))) errors.push("A valid email is required.");
  if (!/^[6-9]\d{9}$/.test(text(c.phone))) errors.push("A valid 10-digit phone number is required.");
  if (text(c.address).length < 5) errors.push("Address is required.");
  if (!text(c.city)) errors.push("City is required.");
  if (!text(c.state)) errors.push("State is required.");
  if (!/^[1-9]\d{5}$/.test(text(c.pincode))) errors.push("A valid 6-digit PIN code is required.");

  return errors;
}

function generateOrderId() {
  const time = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TT-${time}-${random}`;
}

// Put vehicles back on sale if an order could not be completed
async function releaseVehicles(vehicles) {
  if (vehicles.length === 0) return;
  await Vehicle.updateMany(
    { _id: { $in: vehicles.map((v) => v._id) } },
    { status: "available" }
  );
}

// POST /api/orders
// Body: { customer: {...}, vehicleIds: ["...", "..."] }
// The client never sends prices. The server reads them from the database.
const createOrder = asyncHandler(async (req, res) => {
  const { customer, vehicleIds } = req.body;

  const customerErrors = validateCustomer(customer);
  if (customerErrors.length > 0) {
    return res.status(400).json({ message: customerErrors.join(" ") });
  }

  if (!Array.isArray(vehicleIds) || vehicleIds.length === 0) {
    return res.status(400).json({ message: "At least one vehicle is required." });
  }

  const uniqueIds = [...new Set(vehicleIds.map(String))];

  // Ids that are not real database ids (for example old sample vehicles)
  const invalidIds = uniqueIds.filter((id) => !mongoose.isValidObjectId(id));
  if (invalidIds.length > 0) {
    return res.status(409).json({
      message:
        "Some vehicles in your order are not available. Please remove them from your cart and try again.",
      unavailableIds: invalidIds,
    });
  }

  // Claim each vehicle one at a time. findOneAndUpdate only succeeds if the
  // vehicle is still "available", so two buyers cannot get the same vehicle.
  const claimed = [];
  const unavailableIds = [];
  for (const id of uniqueIds) {
    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: id, status: "available" },
      { status: "sold" }
    ); // returns the document as it was before the update
    if (vehicle) claimed.push(vehicle);
    else unavailableIds.push(id);
  }

  if (unavailableIds.length > 0) {
    await releaseVehicles(claimed);
    return res.status(409).json({
      message:
        "Some vehicles are no longer available. Please remove them from your cart and try again.",
      unavailableIds,
    });
  }

  try {
    const items = claimed.map((v) => ({
      vehicle: v._id,
      name: v.name,
      brand: v.brand,
      model: v.model,
      price: v.price, // verified price from the database
    }));
    const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

    const order = await Order.create({
      orderId: generateOrderId(),
      customer,
      items,
      totalAmount,
    });
    res.status(201).json(order);
  } catch (error) {
    await releaseVehicles(claimed); // order failed, so put the vehicles back on sale
    throw error;
  }
});

// GET /api/orders/:id   (accepts the order ID like TT-XXXX or the database id)
const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = mongoose.isValidObjectId(id)
    ? { $or: [{ _id: id }, { orderId: id }] }
    : { orderId: id };

  const order = await Order.findOne(query).lean();
  if (!order) {
    return res.status(404).json({ message: "Order not found." });
  }
  res.json(order);
});

module.exports = { createOrder, getOrder };