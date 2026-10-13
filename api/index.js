// index.js
// Entry point of the Structured Backend API (INSY7314 ICE Task 2).
// Responsibilities: load config, set up global middleware (JSON parsing + CORS),
// mount routes, and register the central error handler LAST.

require('dotenv').config(); // Load variables from .env into process.env

const express = require('express');
const cors = require('cors');

const bookRoutes = require('./routes/bookRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 4000;

// ---------- Controlled CORS configuration ----------
// Only the origin(s) we trust may call this API from a browser.
// Allowed origins come from .env (comma-separated) so nothing is hard-coded.
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());

const corsOptions = {
  origin: (origin, callback) => {
    // Requests with no Origin header (Postman, curl, server-to-server) are allowed.
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Any other browser origin is rejected and handled by the central error handler.
    const err = new Error(`CORS blocked: origin ${origin} is not allowed`);
    err.status = 403;
    return callback(err);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Only the HTTP methods we actually use
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Parse incoming JSON request bodies into req.body
app.use(express.json());

// ---------- Basic routes ----------
// Root route: confirms the API is reachable.
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Secure MERN App API is running' });
});

// Health route: used to check that the server is alive.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// ---------- Resource routes ----------
// All book endpoints live under /api/books
app.use('/api/books', bookRoutes);

// ---------- Error handling (must come after all routes) ----------
app.use(notFound); // Unknown routes -> 404
app.use(errorHandler); // Every error ends up here -> consistent JSON response

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
