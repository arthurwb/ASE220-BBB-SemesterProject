const express = require('express');
const app = express();
const routes = require('./routes/routes');
const apiRoutes = require('./routes/apiRoutes')
const path = require('path');

app.use(express.static(path.join(__dirname, 'public')));

// Use routes
app.use('/', routes);
// Route API
app.use('/api', apiRoutes);

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`${Date()}: Server running on port ${PORT}`);
});