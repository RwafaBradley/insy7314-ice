// routes/bookRoutes.js
// Maps URLs + HTTP methods to controller functions.
// Routes contain NO business logic - they only wire things together.

const express = require('express');
const router = express.Router();

const { getAllBooks, getBookById, createBook } = require('../controllers/bookController');
const validateBookInput = require('../middleware/validateBookInput');

// GET /api/books -> fetch all books
router.get('/', getAllBooks);

// GET /api/books/:id -> fetch one book by its id (e.g. /api/books/b1)
router.get('/:id', getBookById);

// POST /api/books -> add a new book (input is validated first)
router.post('/', validateBookInput, createBook);

module.exports = router;
