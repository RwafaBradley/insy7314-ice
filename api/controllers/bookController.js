// controllers/bookController.js
// Holds the logic for each book endpoint.
// Data is stored in a temporary in-memory array (it resets when the server restarts).
// Each book has 6 attributes: id, title, author, genre, year, price.

const books = [
  { id: 'b1', title: 'Clean Code', author: 'Robert C. Martin', genre: 'Programming', year: 2008, price: 549.99 },
  { id: 'b2', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', genre: 'Programming', year: 1999, price: 499.0 },
];

// Counter used to generate ids like b3, b4, ... for new books
let nextId = books.length + 1;

// GET /api/books
// Returns every book in the in-memory list.
const getAllBooks = (req, res) => {
  res.status(200).json({ count: books.length, data: books });
};

// GET /api/books/:id
// Finds one book by id; passes a 404 error to the central error handler if missing.
const getBookById = (req, res, next) => {
  const book = books.find((b) => b.id === req.params.id);

  if (!book) {
    const err = new Error(`Book with id '${req.params.id}' not found`);
    err.status = 404;
    return next(err);
  }

  res.status(200).json({ data: book });
};

// POST /api/books
// Creates a new book. Input has already been validated by validateBookInput middleware,
// so here we only build the object and store it.
const createBook = (req, res) => {
  const { title, author, genre, year, price } = req.body;

  const newBook = {
    id: `b${nextId++}`,
    title: title.trim(),
    author: author.trim(),
    genre: genre.trim(),
    year,
    price,
  };

  books.push(newBook);
  res.status(201).json({ message: 'Book created', data: newBook });
};

module.exports = { getAllBooks, getBookById, createBook };
