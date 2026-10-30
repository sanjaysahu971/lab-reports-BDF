# Lab 1: Node.js and Express Server

## Student Details

| Field               | Value                              |
|---------------------|------------------------------------|
| **Name**            | Sanjay Thota                       |
| **Registration No.**| 252U1R9162                         |
| **Section**         | CSE(GEN-AI) 2C                     |
| **Course**          | Backend Development Fundamentals   |
| **Academic Term**   | Year II – Term II                  |
| **Faculty**         | Joel Prashanth D                   |
| **Lab**             | 01                                 |

---

## Live Link

- **Deployment URL:** [https://render.com](https://render.com) / [https://vercel.com](https://vercel.com) (Repository: `https://github.com/sanjaysahu971/BDF`)
- **Deployment Status:** Verified locally and configured for serverless deployment (`vercel.json`, dynamic `process.env.PORT`).
- **Local Verification:** All endpoints have been verified with automated local testing, correct HTTP status codes (`200 OK` & `404 Not Found`), and output screenshots included below.

---

## Objective

Set up a Node.js project and build a small web server — first with the built-in `http` module, then with Express — and expose three routes with correct HTTP status codes.

---

## Technologies Used

- **Node.js** — JavaScript runtime environment
- **Express.js** — Fast, unopinionated web framework for Node.js
- **JavaScript (ES6+)** — Asynchronous programming and modern syntax
- **npm** — Node package manager

---

## Project Structure

```text
lab-01/
├── screenshots/
│   ├── home-route.png
│   ├── about-route.png
│   ├── time-route.png
│   └── not-found-route.png
├── server-http.js
├── server.js
├── package.json
├── package-lock.json
├── vercel.json
├── .gitignore
└── README.md
```

---

## How to Run

### Prerequisites

- Node.js (v18 or above) and npm installed
- No external environment variables required

### Install Dependencies

```bash
cd lab-01
npm install
```

### Start the Express Server (Tasks 4–6)

```bash
npm start
# or: node server.js
```

Open your browser or API client at `http://localhost:3000`

### Start the Plain HTTP Server (Task 3)

```bash
npm run start:http
# or: node server-http.js
```

> ⚠️ **Note:** Stop any running server with `Ctrl + C` before switching between servers — both listen on port 3000.

---

## Endpoints

| Method | Path       | Description                                      | Status Code |
|--------|------------|--------------------------------------------------|-------------|
| GET    | `/`        | Returns a plain-text welcome message             | 200 OK      |
| GET    | `/about`   | Returns JSON with student name and section       | 200 OK      |
| GET    | `/time`    | Returns JSON with the current date and time      | 200 OK      |
| GET    | `/*`       | Any unknown path returns a 404 JSON error        | 404 Not Found |

---

## Screenshots

### GET `/` — Home Route
![Home Route](./screenshots/home-route.png)

### GET `/about` — About Route
![About Route](./screenshots/about-route.png)

### GET `/time` — Time Route
![Time Route](./screenshots/time-route.png)

### GET `/unknown` — 404 Not Found
![Not Found Route](./screenshots/not-found-route.png)

---

## Notes & Problems Faced

1. **Port Collision (`EADDRINUSE`):**
   - *Problem:* Running both `server-http.js` and `server.js` simultaneously resulted in `Error: listen EADDRINUSE: address already in use :::3000`.
   - *Solution:* Ensured the previous node process was stopped via `Ctrl + C` before starting the other server, and implemented dynamic port fallback via `process.env.PORT || 3000`.

2. **Catch-All 404 Route Placement:**
   - *Problem:* When registering the 404 middleware before endpoint routes, all incoming requests were caught prematurely as 404.
   - *Solution:* Placed `app.use((req, res) => ...)` at the very bottom of the Express routing stack so that it only catches requests that do not match any defined route.

3. **Dependency Cleanliness in Version Control:**
   - *Problem:* Accidentally tracking `node_modules` causes repository bloat and dependency mismatch across different OS environments.
   - *Solution:* Created `.gitignore` containing `node_modules/` before staging commits, ensuring clean and lightweight git commits.

---

## Viva Answers (Quick Reference)

| Question | Answer |
|----------|--------|
| **Difference between `package.json` and `node_modules`?** | `package.json` is a configuration manifest listing project metadata, scripts, and dependency version specifications. `node_modules/` is the physical directory on disk where the actual downloaded packages and their dependencies reside. |
| **What does `app.listen` do?** | It binds the Express web application to a specified TCP port and IP address, and begins listening for incoming HTTP requests. |
| **What do `request` and `response` represent?** | `request` (`req`) is an object representing the incoming HTTP request containing HTTP headers, query params, URL path, and request body. `response` (`res`) is the object used to format and send the HTTP response (status code, headers, payload) back to the client. |
