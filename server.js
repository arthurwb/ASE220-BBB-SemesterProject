const express = require('express');
const app = express();
const routes = require('./routes/routes');
const apiRoutes = require('./routes/apiRoutes')
const path = require('path');
const port = 8080;

app.use(express.static(path.join(__dirname, 'public')));

// Route API
app.use('/api', apiRoutes);
// Use routes
app.use('/', routes);

// Start server
async function start(){
	app.listen(port,()=>{
	  console.log(`Example app listening on port ${port}`)
	})
}
start()