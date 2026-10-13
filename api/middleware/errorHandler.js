// middleware/errorHandler.js
// Central error handling: every error in the app ends up here,
// so all error responses share the same JSON shape.

// Runs when no route matched the request -> creates a 404 error and forwards it.
const notFound = (req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

// Express recognises an error handler by its 4 parameters (err, req, res, next).
const errorHandler = (err, req, res, next) => {
  // Malformed JSON body sent by the client
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON in request body' });
  }

  const status = err.status || 500;

  // Log full details on the server only; never leak internals to the client.
  if (status === 500) console.error(err);

  res.status(status).json({
    message: status === 500 ? 'Internal server error' : err.message,
  });
};

module.exports = { notFound, errorHandler };
