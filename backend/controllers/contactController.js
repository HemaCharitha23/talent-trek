const ContactMessage = require("../models/ContactMessage");
const asyncHandler = require("../middleware/asyncHandler");

// POST /api/contact
const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  await ContactMessage.create({ name, email, subject, message });
  res.status(201).json({ message: "Your message has been saved." });
});

module.exports = { createContactMessage };