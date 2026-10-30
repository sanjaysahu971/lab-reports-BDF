const express = require('express')
const {open} = require('sqlite')
const path = require('path')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 3000
const dbPath = path.join(__dirname, 'database.db')
let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`Endpoints available:`)
      console.log(`  GET    /books/          - Retrieve all books`)
      console.log(`  GET    /books/:bookId/  - Retrieve a single book by ID`)
      console.log(`  POST   /books/          - Add a new book`)
      console.log(`  PUT    /books/:bookId/  - Update an existing book`)
      console.log(`  DELETE /books/:bookId/  - Delete a book`)
    })
  } catch (error) {
    console.error(`Database error: ${error.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

// API 1: Get all books
// GET /books/
app.get('/books/', async (request, response) => {
  try {
    const getBooksQuery = `
      SELECT *
      FROM book
      ORDER BY id;
    `
    const books = await db.all(getBooksQuery)
    response.status(200).json(books)
  } catch (error) {
    response.status(500).json({error: error.message})
  }
})

// API 2: Add a book
// POST /books/
app.post('/books/', async (request, response) => {
  try {
    const {title, author, price, pages} = request.body

    // Input validation
    if (!title || !author || price === undefined || pages === undefined) {
      return response.status(400).send('All book fields (title, author, price, pages) are required')
    }

    const addBookQuery = `
      INSERT INTO book (title, author, price, pages)
      VALUES (?, ?, ?, ?);
    `
    await db.run(addBookQuery, [title, author, price, pages])
    response.status(201).send('Book Added Successfully')
  } catch (error) {
    response.status(500).json({error: error.message})
  }
})

// API 3: Get a particular book
// GET /books/:bookId/
app.get('/books/:bookId/', async (request, response) => {
  try {
    const {bookId} = request.params

    if (isNaN(bookId)) {
      return response.status(400).json({error: 'Invalid book ID'})
    }

    const getBookQuery = `
      SELECT *
      FROM book
      WHERE id = ?;
    `
    const book = await db.get(getBookQuery, [bookId])

    if (!book) {
      return response.status(404).json({error: 'Book not found'})
    }

    response.status(200).json(book)
  } catch (error) {
    response.status(500).json({error: error.message})
  }
})

// API 4: Update a book
// PUT /books/:bookId/
app.put('/books/:bookId/', async (request, response) => {
  try {
    const {bookId} = request.params
    const {title, author, price, pages} = request.body

    if (isNaN(bookId)) {
      return response.status(400).json({error: 'Invalid book ID'})
    }

    const updateBookQuery = `
      UPDATE book
      SET title = ?,
          author = ?,
          price = ?,
          pages = ?
      WHERE id = ?;
    `
    const result = await db.run(updateBookQuery, [title, author, price, pages, bookId])

    if (result.changes === 0) {
      return response.status(404).json({error: 'Book not found'})
    }

    response.status(200).send('Book Details Updated')
  } catch (error) {
    response.status(500).json({error: error.message})
  }
})

// API 5: Delete a book
// DELETE /books/:bookId/
app.delete('/books/:bookId/', async (request, response) => {
  try {
    const {bookId} = request.params

    if (isNaN(bookId)) {
      return response.status(400).json({error: 'Invalid book ID'})
    }

    const deleteBookQuery = `
      DELETE FROM book
      WHERE id = ?;
    `
    const result = await db.run(deleteBookQuery, [bookId])

    if (result.changes === 0) {
      return response.status(404).json({error: 'Book not found'})
    }

    response.status(200).send('Book Removed')
  } catch (error) {
    response.status(500).json({error: error.message})
  }
})

// 404 Handler for undefined routes
app.use((request, response) => {
  response.status(404).json({
    error: '404 – Endpoint Not Found',
    message: `The path '${request.url}' does not exist on this server.`,
  })
})

module.exports = app
