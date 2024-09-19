const express = require('express');
const path = require('path');
const app = express();
const port = 5000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../weatherpulse/build')));

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../weatherpulse/build/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
