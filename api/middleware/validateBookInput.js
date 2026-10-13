// middleware/validateBookInput.js
// Validates the request body before a book is created.
// If anything is wrong it responds with 400 and a list of problems;
// otherwise it calls next() so the controller can run.

const validateBookInput = (req, res, next) => {
  const { title, author, genre, year, price } = req.body || {};
  const errors = [];

  // title, author and genre must be non-empty strings
  ['title', 'author', 'genre'].forEach((field) => {
    const value = req.body ? req.body[field] : undefined;
    if (typeof value !== 'string' || value.trim() === '') {
      errors.push(`${field} is required and must be a non-empty string`);
    } else if (value.trim().length > 100) {
      errors.push(`${field} must be 100 characters or fewer`);
    }
  });

  // year must be a whole number within a sensible range
  const currentYear = new Date().getFullYear();
  if (!Number.isInteger(year) || year < 1000 || year > currentYear) {
    errors.push(`year is required and must be a whole number between 1000 and ${currentYear}`);
  }

  // price must be a number greater than 0
  if (typeof price !== 'number' || Number.isNaN(price) || price <= 0) {
    errors.push('price is required and must be a number greater than 0');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

module.exports = validateBookInput;
