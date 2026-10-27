// Tasks 4–6: Express server with routes and 404 handler

// Import the Express framework
const express = require('express');

// Create the Express application
const app = express();

const PORT = process.env.PORT || 3000;

// ─── Routes ──────────────────────────────────────────────────────────────────

// GET /  →  Welcome message  (Status 200)
app.get('/', (req, res) => {
  res.status(200).send('Welcome to Lab 1 – Node.js and Express server!');
});

// GET /about  →  JSON with student info  (Status 200)
app.get('/about', (req, res) => {
  res.status(200).json({
    name: 'Sanjay Thota',
    section: 'CSE(GEN-AI) 2C',
  });
});

// GET /time  →  Current date and time  (Status 200)
app.get('/time', (req, res) => {
  const currentTime = new Date();
  res.status(200).json({
    currentTime: currentTime.toString(),
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
// This catches every request that didn't match any route above.
app.use((req, res) => {
  res.status(404).json({
    error: '404 – Page Not Found',
    message: `The path '${req.url}' does not exist on this server.`,
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
// app.listen tells Express to start listening for incoming HTTP requests.
// The callback runs once the server is ready.
app.listen(PORT, () => {
  console.log(`Express server is running at http://localhost:${PORT}`);
  console.log('Available routes:');
  console.log('  GET /       → Welcome message');
  console.log('  GET /about  → Student info (JSON)');
  console.log('  GET /time   → Current date and time (JSON)');
  console.log('  Any other   → 404 Not Found');
});

// Export for serverless platforms (e.g. Vercel)
module.exports = app;
