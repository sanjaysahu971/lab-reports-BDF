-- Lab 2: SQLite database and CRUD routes
-- Table Schema and Seed Data
-- Student Name: Sanjay Thota
-- Registration Number: 252U1R9162
-- Section: CSE(GEN-AI) 2C
-- Course: Backend Development Fundamentals (Year II – Term II)

-- Reset table if it already exists
DROP TABLE IF EXISTS book;

-- Create book table
CREATE TABLE IF NOT EXISTS book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    price INTEGER NOT NULL,
    pages INTEGER NOT NULL
);

-- Insert 10 initial sample records
INSERT INTO book (title, author, price, pages) VALUES
('The Pragmatic Programmer', 'Andrew Hunt & David Thomas', 45, 352),
('Clean Code', 'Robert C. Martin', 40, 464),
('Designing Data-Intensive Applications', 'Martin Kleppmann', 50, 616),
('System Design Interview', 'Alex Xu', 38, 300),
('JavaScript: The Good Parts', 'Douglas Crockford', 30, 176),
('Node.js Design Patterns', 'Mario Casciaro & Luciano Mammino', 42, 520),
('Introduction to Algorithms', 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein', 85, 1312),
('Refactoring: Improving the Design of Existing Code', 'Martin Fowler', 48, 448),
('Eloquent JavaScript', 'Marijn Haverbeke', 35, 472),
('Backend Development Fundamentals', 'Sanjay Thota', 38, 290);
