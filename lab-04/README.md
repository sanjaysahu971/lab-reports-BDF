# Lab 4: User Authentication API

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
| **Lab Title** | Lab 4 – User Authentication API with Express, SQLite & bcrypt |

---

## 1. Overview

An Express.js REST API for user authentication and authorization workflows including:
1. **User Registration (`POST /register`)**: Validates username uniqueness, enforces password length constraints (minimum 5 characters), and securely hashes passwords using `bcrypt` before storing them in SQLite.
2. **User Login (`POST /login`)**: Verifies username existence and checks passwords using `bcrypt.compare`.
3. **Change Password (`PUT /change-password`)**: Authenticates current password and updates to a new hashed password with minimum length validation.

---

## 2. Technologies Used

- **Node.js** (JavaScript runtime)
- **Express.js** (`express` v5) — Web framework for handling HTTP routing
- **bcrypt** (`bcrypt` v6) — Password hashing library implementing adaptive salt-based cryptography
- **SQLite3** (`sqlite3` v6) & **Promise Wrapper** (`sqlite` v5) — Lightweight file-based relational database
- **Nodemon** — Automatic server reload during development

---

## 3. Project Structure

```text
lab-04/
├── app.js               # Express server, SQLite connection & authentication routes
├── userData.db          # Persistent SQLite database containing user credentials
├── package.json         # Project metadata, dependencies, and npm scripts
├── package-lock.json    # Dependency lockfile
├── bun.lock             # Bun lockfile reference
├── .gitignore           # Excludes node_modules/ and sensitive files
└── README.md            # Comprehensive documentation
```

---

## 4. Database Schema: `user`

The SQLite database file `userData.db` stores registered user credentials:

```sql
CREATE TABLE user (
    username TEXT,
    name TEXT,
    password TEXT,
    gender TEXT,
    location TEXT
);
```

### Table Columns

| Column | Type | Description |
|---|---|---|
| `username` | TEXT | Unique user handle used for authentication |
| `name` | TEXT | Full name of the user |
| `password` | TEXT | `bcrypt` salted hash of the user password |
| `gender` | TEXT | Gender identifier (`male`, `female`, etc.) |
| `location` | TEXT | City or location of the user |

---

## 5. Setup & Running Instructions

### Step 1: Navigate to `lab-04`
```bash
cd lab-04
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

The API will listen at:
`http://localhost:3000/`

---

## 6. API Endpoints & Response Specifications

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a new user with hashed password |
| `POST` | `/login` | Authenticate an existing user |
| `PUT` | `/change-password` | Update user password after validating existing credentials |

---

### 1. Register: `POST /register`

#### Request Headers
`Content-Type: application/json`

#### Request Body
```json
{
  "username": "adam_richard",
  "name": "Adam Richard",
  "password": "richard_567",
  "gender": "male",
  "location": "Detroit"
}
```

#### Possible Responses

| Scenario | HTTP Status | Response Body |
|---|:---:|---|
| Username already registered | `400 Bad Request` | `User already exists` |
| Password length < 5 characters | `400 Bad Request` | `Password is too short` |
| Successful registration | `200 OK` | `User created successfully` |

---

### 2. Login: `POST /login`

#### Request Headers
`Content-Type: application/json`

#### Request Body
```json
{
  "username": "adam_richard",
  "password": "richard_567"
}
```

#### Possible Responses

| Scenario | HTTP Status | Response Body |
|---|:---:|---|
| Username does not exist | `400 Bad Request` | `Invalid user` |
| Incorrect password | `400 Bad Request` | `Invalid password` |
| Successful login | `200 OK` | `Login success!` |

---

### 3. Change Password: `PUT /change-password`

#### Request Headers
`Content-Type: application/json`

#### Request Body
```json
{
  "username": "adam_richard",
  "oldPassword": "richard_567",
  "newPassword": "richard@123"
}
```

#### Possible Responses

| Scenario | HTTP Status | Response Body |
|---|:---:|---|
| Username does not exist | `400 Bad Request` | `Invalid user` |
| Incorrect current password | `400 Bad Request` | `Invalid current password` |
| New password < 5 characters | `400 Bad Request` | `Password is too short` |
| Successful password update | `200 OK` | `Password updated` |

---

## 7. Security Best Practices Implemented

1. **Password Hashing with Salt:**
   Passwords are never stored in plaintext. `bcrypt.hash(password, 10)` generates a salt with cost factor 10, protecting stored passwords from dictionary and rainbow-table attacks.
2. **Secure Comparison:**
   `bcrypt.compare(password, dbUser.password)` uses constant-time string comparison to safeguard against timing attacks.
3. **Password Minimum Length Enforcement:**
   Both registration and password change operations reject passwords shorter than 5 characters.
