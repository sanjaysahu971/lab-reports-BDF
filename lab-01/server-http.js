// Task 3: Plain HTTP server using the built-in 'http' module
// This was the original way to build servers in Node.js before Express existed.

const http = require('http');

const PORT = 3000;

// http.createServer takes a callback that runs for every incoming request.
// 'req' holds all request info (method, URL, headers, etc.)
// 'res' is used to write the response back to the client.
const server = http.createServer((req, res) => {
  // Set HTTP status 200 (OK) and content type
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Send the response body and close the connection
  res.end('Hello');
});

// Start listening on port 3000
server.listen(PORT, () => {
  console.log(`HTTP server is running at http://localhost:${PORT}`);
});
