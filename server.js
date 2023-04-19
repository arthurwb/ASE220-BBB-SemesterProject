const express = require('express');
const app = express();
const routes = require('./routes/routes');
const apiRoutes = require('./routes/apiRoutes')
const path = require('path');
const port = 8080

// data =
// {
//   "firstname":"test"
// }

// async function insert(db,database,collection,document){
//   let dbo=db.db(database)
//   let result=await dbo.collection(collection).insertOne(document)
//   console.log(result)
//   return result;
// }

// async function find(db,database,collection,criteria){
//   let dbo=db.db(database)
//   let result=await dbo.collection(collection).find(criteria).toArray()
//   console.log(result);
//   return result;
// }

//app.post('/',async function(req,res){
//	console.log(req.body);
//	let result=await insert(db,'myWebsite','users',req.body)
//	result=await find(db,'myWebsite','users',{})
//	res.json(result)
//})

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