const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required."], trim: true, maxlength: 100 },
  email: {
    type: String,
    required: [true, "Email is required."],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Enter a valid email address."],
  },
  subject: { type: String, required: [true, "Subject is required."], trim: true, maxlength: 150 },
  message: {
    type: String,
    required: [true, "Message is required."],
    trim: true,
    minlength: [10, "Message must be at least 10 characters."],
    maxlength: [2000, "Message is too long (maximum 2000 characters)."],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ContactMessage", contactMessageSchema);