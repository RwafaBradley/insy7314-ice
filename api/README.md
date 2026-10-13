# Secure MERN App – Structured Backend API (INSY7314 ICE Task 2)

A structured Express backend API that manages a **books** resource, stored in a temporary in-memory array
(data resets whenever the server restarts).

Each book has 6 attributes: `id`, `title`, `author`, `genre`, `year`, `price`.

## Folder structure

```
secure-mern-app/
└── api/
    ├── controllers/
    │   └── bookController.js
    ├── middleware/
    │   ├── errorHandler.js
    │   └── validateBookInput.js
    ├── routes/
    │   └── bookRoutes.js
    ├── .env
    ├── .gitignore
    ├── index.js
    ├── package-lock.json
    └── package.json
```

## How to run

```bash
cd api
npm install
npm start
```

The server runs on `http://localhost:4000` (port set in `.env`).
`.env` contents: `PORT=4000` and `CLIENT_ORIGIN=http://localhost:3000` (the one browser origin allowed by CORS).

## Routes / endpoints tested in Postman

| # | Method | URL | Purpose | Expected |
|---|--------|-----|---------|----------|
| 1 | GET | `http://localhost:4000/` | Root route | 200 |
| 2 | GET | `http://localhost:4000/health` | Server health check | 200 |
| 3 | GET | `http://localhost:4000/api/books` | Fetch all books | 200 |
| 4 | GET | `http://localhost:4000/api/books/b1` | Fetch one book by id | 200 |
| 5 | GET | `http://localhost:4000/api/books/b99` | Book that does not exist | 404 |
| 6 | POST | `http://localhost:4000/api/books` | Add a new book | 201 |

Two books (`b1`, `b2`) exist when the server starts. New books receive ids `b3`, `b4`, ...

## Sample request bodies – five new books (POST `/api/books`)

Header: `Content-Type: application/json`

```json
{ "title": "Atomic Habits", "author": "James Clear", "genre": "Self-Help", "year": 2018, "price": 299.5 }
```
```json
{ "title": "The Hobbit", "author": "J.R.R. Tolkien", "genre": "Fantasy", "year": 1937, "price": 189.99 }
```
```json
{ "title": "Sapiens", "author": "Yuval Noah Harari", "genre": "History", "year": 2011, "price": 349.0 }
```
```json
{ "title": "Dune", "author": "Frank Herbert", "genre": "Science Fiction", "year": 1965, "price": 259.95 }
```
```json
{ "title": "Long Walk to Freedom", "author": "Nelson Mandela", "genre": "Biography", "year": 1994, "price": 279.0 }
```

Each returns `201 Created`, for example:

```json
{ "message": "Book created", "data": { "id": "b3", "title": "Atomic Habits", "author": "James Clear", "genre": "Self-Help", "year": 2018, "price": 299.5 } }
```

## Input validation tests (all return `400 Bad Request`)

| Test | Request body | Error message returned |
|------|--------------|------------------------|
| Missing title | `{ "author": "X", "genre": "Y", "year": 2020, "price": 10 }` | `title is required and must be a non-empty string` |
| Year not a number | `{ "title": "T", "author": "A", "genre": "G", "year": "abc", "price": 10 }` | `year is required and must be a whole number between 1000 and 2026` |
| Negative price | `{ "title": "T", "author": "A", "genre": "G", "year": 2020, "price": -5 }` | `price is required and must be a number greater than 0` |
| Empty body | `{}` | One error for each of the 5 fields |
| Malformed JSON | `{bad` | `Invalid JSON in request body` |

## Other behaviour

- **Unknown route** (e.g. `GET /nope`) → `404` `Route not found: GET /nope`
- **Central error handler** (`middleware/errorHandler.js`) gives every error the same JSON shape: `{ "message": "..." }`
- **Controlled CORS**: only origins listed in `CLIENT_ORIGIN` may call the API from a browser; others get `403`.
