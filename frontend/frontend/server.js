// server.js
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });