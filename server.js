const express = require('express');
const app = express();
const routes = require('./routes/routes');
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', routes);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});