const mongoose = require("mongoose");

const currentYear = new Date().getFullYear();

const vehicleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Vehicle name is required."],
    trim: true,
    maxlength: [120, "Vehicle name is too long."],
  },
  brand: {
    type: String,
    required: [true, "Brand is required."],
    trim: true,
  },
  model: {
    type: String,
    required: [true, "Model is required."],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required."],
    enum: {
      values: ["Cars", "Bikes", "Scooties", "Lorries"],
      message: "Category must be Cars, Bikes, Scooties or Lorries.",
    },
  },
  manufacturingYear: {
    type: Number,
    required: [true, "Manufacturing year is required."],
    min: [1980, "Manufacturing year must be 1980 or later."],
    max: [currentYear, `Manufacturing year cannot be later than ${currentYear}.`],
    validate: {
      validator: Number.isInteger,
      message: "Manufacturing year must be a whole number.",
    },
  },
  price: {
    type: Number,
    required: [true, "Price is required."],
    min: [1, "Price must be greater than 0."],
  },
  fuelType: {
    type: String,
    required: [true, "Fuel type is required."],
    enum: {
      values: ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"],
      message: "Fuel type must be Petrol, Diesel, CNG, Electric or Hybrid.",
    },
  },
  transmission: {
    type: String,
    enum: {
      values: ["Manual", "Automatic"],
      message: "Transmission must be Manual or Automatic.",
    },
  },
  kilometersDriven: {
    type: Number,
    required: [true, "Kilometers driven is required."],
    min: [0, "Kilometers driven cannot be negative."],
  },
  condition: {
    type: String,
    required: [true, "Condition is required."],
    enum: {
      values: ["Excellent", "Good", "Fair"],
      message: "Condition must be Excellent, Good or Fair.",
    },
  },
  location: {
    type: String,
    required: [true, "Location is required."],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required."],
    trim: true,
    minlength: [10, "Description must be at least 10 characters."],
    maxlength: [2000, "Description is too long (maximum 2000 characters)."],
  },
  contactNumber: {
    type: String,
    trim: true,
    match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number."],
  },
  images: {
    type: [String],
    default: [],
  },
  specs: {
    type: Object,
    default: {},
  },
  status: {
    type: String,
    enum: {
      values: ["available", "reserved", "sold"],
      message: "Status must be available, reserved or sold.",
    },
    default: "available",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Vehicle", vehicleSchema);