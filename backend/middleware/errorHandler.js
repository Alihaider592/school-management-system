function errorHandler(err, req, res, next) {
  console.error(err);

  // Mongoose duplicate key error (e.g. duplicate rollNumber or email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({ message: `A record with that ${field} already exists.` });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || "Something went wrong on the server.",
  });
}

module.exports = errorHandler;
