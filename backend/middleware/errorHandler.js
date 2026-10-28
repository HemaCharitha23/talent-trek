function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  // Mongoose validation errors (bad or missing fields)
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(" ") });
  }

  // Wrong data type, e.g. text where a number is expected
  if (err.name === "CastError") {
    return res.status(400).json({ message: `Invalid value for "${err.path}".` });
  }

  // Broken JSON in the request body
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body is not valid JSON." });
  }

  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server." });
}

module.exports = { notFound, errorHandler };