# Lab 3: REST API, Query Parameters, Validation and Debugging

## Student & Course Details

| Field | Details |
|---|---|
| **Student Name** | Sanjay Thota |
| **Registration Number** | 252U1R9162 |
| **Section** | CSE(GEN-AI) 2C |
| **Subject** | Backend Development Fundamentals |
| **Academic Year & Term** | Year II – Term II |
| **College** | Aurora |
| **Faculty** | Joel Prashanth D |
| **Lab Title** | Lab 3 – REST API, Query Parameters, Validation and Debugging |

---

## 1. Project Overview

In **Lab 3**, we continue directly from **Lab 2** using Node.js, Express.js, and SQLite (`database.db`). We upgrade the Books CRUD application with:
1. **Query Parameters (`request.query`)**:
   - `search_q`: Partial title match with SQL `LIKE`
   - `order_by`: Allowed column sorting (`id`, `title`, `author`, `price`, `pages`)
   - `order`: `ASC` or `DESC`
   - `limit` & `offset`: Pagination controls
   - `min_price` & `max_price`: Price range filtering
2. **Parameterized Queries**: Protecting against SQL injection using `?` placeholders.
3. **Robust Input Validation**: Strict validation for required fields and data types (`title`, `author`, `price`, `pages`).
4. **Standard JSON Responses & Status Codes**: Returning `200`, `201`, `400`, `404`, and `500` with clean JSON.
5. **Systematic Debugging**: Analyzing `EADDRINUSE`, wrong import paths, SQLite table-name typos, and missing `await`.

---

## 2. Technology Stack

- **Node.js** (JavaScript Runtime)
- **Express.js** (`express` v4.21.2)
- **SQLite Database** (`sqlite` v5.1.1 and `sqlite3` v5.1.7)
- **Postman** (API Testing & Verification)
- **VS Code** (IDE)

---

## 3. Project Structure

```text
lab-03/
├── screenshots/         # Postman verification screenshots
├── database.db          # Reused SQLite database from Lab 2 (10 records)
├── package.json         # Project configuration & npm scripts
├── package-lock.json    # Dependency lockfile
├── seed.sql             # SQL schema and seed data
├── server.js            # Express application with database & all 5 endpoints
├── .gitignore           # Excludes node_modules, .env, and logs
├── README.md            # Comprehensive documentation & test reports
└── Lab-03-Postman-Collection.json # Postman test collection
```

---

## 4. Database Schema: `book`

The database schema is defined in `seed.sql` and preserved in `database.db`:

```sql
DROP TABLE IF EXISTS book;

CREATE TABLE IF NOT EXISTS book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price INTEGER NOT NULL,
    pages INTEGER NOT NULL
);
```

### Initial Seed Data (10 Records from Lab 2)

| ID | Title | Author | Price ($) | Pages |
|:---:|---|---|:---:|:---:|
| 1 | The Pragmatic Programmer | Andrew Hunt & David Thomas | 45 | 352 |
| 2 | Clean Code | Robert C. Martin | 40 | 464 |
| 3 | Designing Data-Intensive Applications | Martin Kleppmann | 50 | 616 |
| 4 | System Design Interview | Alex Xu | 38 | 300 |
| 5 | JavaScript: The Good Parts | Douglas Crockford | 30 | 176 |
| 6 | Node.js Design Patterns | Mario Casciaro & Luciano Mammino | 42 | 520 |
| 7 | Introduction to Algorithms | Thomas H. Cormen et al. | 85 | 1312 |
| 8 | Refactoring: Improving the Design of Existing Code | Martin Fowler | 48 | 448 |
| 9 | Eloquent JavaScript | Marijn Haverbeke | 35 | 472 |
| 10 | Backend Development Fundamentals | Sanjay Thota | 38 | 290 |

---

## 5. Setup & Running Instructions

### Step 1: Navigate to `lab-03`
```bash
cd lab-03
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run the Server
```bash
npm start
```
or with nodemon for auto-reload:
```bash
npm run dev
```

The server listens on:
`http://localhost:3000/`

---

## 6. REST API Endpoints

### 1. `GET /books`
Retrieves books with optional query parameters.
- **Query Parameters**:
  - `search_q` (default: `''`): Searches title via SQL `LIKE ?`
  - `order_by` (default: `'id'`): Allowed values: `id`, `title`, `author`, `price`, `pages`
  - `order` (default: `'ASC'`): `ASC` or `DESC`
  - `limit` (default: `10`): Max records returned
  - `offset` (default: `0`): Records skipped
  - `min_price` (default: `0`): Minimum price
  - `max_price` (default: `1000000`): Maximum price
- **Response `200 OK`**: Array of book objects.

### 2. `GET /books/:bookId`
Retrieves a single book by ID.
- **Response `200 OK`**: Book object.
- **Response `404 Not Found`**: `{ "error": "Book Not Found" }`

### 3. `POST /books`
Inserts a new book.
- **Body (JSON)**: `{ "title": "...", "author": "...", "price": 50, "pages": 300 }`
- **Validation**:
  - Title cannot be missing/empty: `400 Bad Request` `{ "error": "Invalid or missing title" }`
  - Author cannot be missing/empty: `400 Bad Request` `{ "error": "Invalid or missing author" }`
  - Price must be numeric: `400 Bad Request` `{ "error": "Price must be a valid number" }`
  - Pages must be numeric: `400 Bad Request` `{ "error": "Pages must be a valid number" }`
- **Response `201 Created`**: `{ "message": "Book Added Successfully", "bookId": 11 }`

### 4. `PUT /books/:bookId`
Updates an existing book.
- **Body (JSON)**: `{ "title": "...", "author": "...", "price": 50, "pages": 300 }`
- **Response `200 OK`**: `{ "message": "Book Details Updated" }`
- **Response `404 Not Found`**: `{ "error": "Book Not Found" }`

### 5. `DELETE /books/:bookId`
Deletes a book by ID.
- **Response `200 OK`**: `{ "message": "Book Removed" }`
- **Response `404 Not Found`**: `{ "error": "Book Not Found" }`

---

## 7. Postman Verification Test Suite (20 Test Cases)

| # | Test Name | Method | Exact URL | Request Body | Expected Status | Expected Response Format | Screenshot Filename |
|:---:|---|:---:|---|---|:---:|---|---|
| **1** | GET all books | `GET` | `http://localhost:3000/books` | *None* | `200 OK` | Array of 10 book records | `screenshots/01-get-all-books.png` |
| **2** | Search books | `GET` | `http://localhost:3000/books?search_q=JavaScript` | *None* | `200 OK` | Array of 2 books matching "JavaScript" | `screenshots/02-search-books.png` |
| **3** | Sort books ASC | `GET` | `http://localhost:3000/books?order_by=price&order=ASC` | *None* | `200 OK` | Array sorted by price ascending (30 to 85) | `screenshots/03-sort-books-asc.png` |
| **4** | Sort books DESC | `GET` | `http://localhost:3000/books?order_by=price&order=DESC` | *None* | `200 OK` | Array sorted by price descending (85 to 30) | `screenshots/04-sort-books-desc.png` |
| **5** | Pagination – Page 1 | `GET` | `http://localhost:3000/books?limit=3&offset=0` | *None* | `200 OK` | Array of first 3 books (IDs 1, 2, 3) | `screenshots/05-pagination-page-1.png` |
| **6** | Pagination – Page 2 | `GET` | `http://localhost:3000/books?limit=3&offset=3` | *None* | `200 OK` | Array of next 3 books (IDs 4, 5, 6) | `screenshots/06-pagination-page-2.png` |
| **7** | Min price filter | `GET` | `http://localhost:3000/books?min_price=45` | *None* | `200 OK` | Books with price >= 45 | `screenshots/07-min-price-filter.png` |
| **8** | Max price filter | `GET` | `http://localhost:3000/books?max_price=40` | *None* | `200 OK` | Books with price <= 40 | `screenshots/08-max-price-filter.png` |
| **9** | Price range filter | `GET` | `http://localhost:3000/books?min_price=35&max_price=45` | *None* | `200 OK` | Books with 35 <= price <= 45 | `screenshots/09-price-range-filter.png` |
| **10**| Combined query params | `GET` | `http://localhost:3000/books?search_q=Design&min_price=30&order_by=price&order=DESC&limit=5&offset=0` | *None* | `200 OK` | Filtered, sorted, paginated array | `screenshots/10-combined-query-params.png` |
| **11**| GET book by ID | `GET` | `http://localhost:3000/books/1` | *None* | `200 OK` | Book object with ID 1 | `screenshots/11-get-book-by-id.png` |
| **12**| GET invalid book ID | `GET` | `http://localhost:3000/books/999` | *None* | `404 Not Found` | `{"error": "Book Not Found"}` | `screenshots/12-get-invalid-book-id.png` |
| **13**| POST valid book | `POST`| `http://localhost:3000/books` | `{"title": "Mastering Full Stack", "author": "Sanjay Thota", "price": 55, "pages": 420}` | `201 Created` | `{"message": "Book Added Successfully", "bookId": 11}` | `screenshots/13-post-valid-book.png` |
| **14**| POST without title | `POST`| `http://localhost:3000/books` | `{"author": "Sanjay Thota", "price": 55, "pages": 420}` | `400 Bad Request` | `{"error": "Invalid or missing title"}` | `screenshots/14-post-without-title.png` |
| **15**| POST without author| `POST`| `http://localhost:3000/books` | `{"title": "Mastering Full Stack", "price": 55, "pages": 420}` | `400 Bad Request` | `{"error": "Invalid or missing author"}` | `screenshots/15-post-without-author.png` |
| **16**| POST invalid price | `POST`| `http://localhost:3000/books` | `{"title": "Mastering Full Stack", "author": "Sanjay Thota", "price": "free", "pages": 420}` | `400 Bad Request` | `{"error": "Price must be a valid number"}` | `screenshots/16-post-invalid-price.png` |
| **17**| PUT update book | `PUT` | `http://localhost:3000/books/1` | `{"title": "The Pragmatic Programmer", "author": "Andrew Hunt & David Thomas", "price": 45, "pages": 352}` | `200 OK` | `{"message": "Book Details Updated"}` | `screenshots/17-put-update-book.png` |
| **18**| PUT invalid ID | `PUT` | `http://localhost:3000/books/9999` | `{"title": "Ghost", "author": "Unknown", "price": 30, "pages": 100}` | `404 Not Found` | `{"error": "Book Not Found"}` | `screenshots/18-put-invalid-book-id.png` |
| **19**| DELETE book | `DELETE` | `http://localhost:3000/books/11` | *None* | `200 OK` | `{"message": "Book Removed"}` | `screenshots/19-delete-book.png` |
| **20**| DELETE invalid ID | `DELETE` | `http://localhost:3000/books/9999` | *None* | `404 Not Found` | `{"error": "Book Not Found"}` | `screenshots/20-delete-invalid-book-id.png` |

---

## 8. Debugging Exercises

### 1. `EADDRINUSE` – Port Already in Use
- **Broken Command:** `node server.js` while an old instance is running.
- **Error Message:** `Error: listen EADDRINUSE: address already in use :::3000`
- **Reason:** Two processes cannot bind to port 3000 simultaneously.
- **Solution (PowerShell):**
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
  ```
- **Verification:** Run `netstat -ano | findstr :3000` to confirm port is released, then restart server.

### 2. Wrong Import Path (`MODULE_NOT_FOUND`)
- **Broken Code:** `const { getDB } = require('./database/db')` from inside `routes/books.js`.
- **Error Message:** `Error: Cannot find module './database/db'`
- **Reason:** Relative paths resolve relative to `__dirname` of the caller. Inside `routes/`, `./database/db` searches `routes/database/db.js`.
- **Solution:** Use double dots `../database/db` to traverse up to the project root.
- **Verification:** `node -c routes/books.js` exits cleanly.

### 3. SQLite Table-Name Typo (`no such table`)
- **Broken Code:** `SELECT * FROM books WHERE id = ?;` (plural `books`).
- **Error Message:** `SQLITE_ERROR: no such table: books`
- **Reason:** Table was created as `book` (singular) in `seed.sql`. SQLite requires exact table identifier matching.
- **Solution:** Change `books` to `book`: `SELECT * FROM book WHERE id = ?;`.
- **Verification:** Verify table with `SELECT name FROM sqlite_master WHERE type='table';`.

### 4. Missing `await` in Asynchronous Code
- **Broken Code:**
  ```javascript
  const book = db.get('SELECT * FROM book WHERE id = ?', [bookId]);
  ```
- **Error / Symptom:** Endpoint responds with empty `{}` instead of the book record, or throws `TypeError` when reading properties.
- **Reason:** `db.get()` returns a Promise. Without `await`, JavaScript serializes a pending Promise (which produces `{}` in JSON).
- **Solution:** Add `await`:
  ```javascript
  const book = await db.get('SELECT * FROM book WHERE id = ?', [bookId]);
  ```
- **Verification:** `GET /books/1` returns the full book JSON object.

---

## 9. Problems Faced & Solutions

1. **SQL Injection Prevention:** Solved by binding all query parameter values (`search_q`, `min_price`, `max_price`, `limit`, `offset`) via `?` placeholders.
2. **Dynamic Order By Injection:** SQL does not support `?` placeholders for column names. Solved by validating `order_by` against `allowedColumns = ['id', 'title', 'author', 'price', 'pages']`.
3. **Empty Response Bugs:** Resolved by using `async/await` across all database query operations.

---

## 10. Cloud Deployment Note

SQLite stores all records in a single local file (`database.db`). Standard free cloud providers (like Render or Vercel serverless) use **ephemeral disks**, resetting files on restarts. In production, persistent storage volumes (Render Disks, AWS EBS) or managed databases (PostgreSQL) are used. For Lab 3, SQLite is thoroughly tested and verified locally.
