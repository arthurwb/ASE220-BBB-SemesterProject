const express = require('express');
const app = express();
const routes = require('./routes/routes');
const apiRoutes = require('./routes/apiRoutes')
const path = require('path');
const port = 8080
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin@qb3cluster.sknm95g.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
app.use(bodyParser.json())
var db=null

data =
{
  "firstname":"test"
}

async function connect(){
	let connection=await client.connect()
	return connection
}

async function insert(db,database,collection,document){
  let dbo=db.db(database)
  let result=await dbo.collection(collection).insertOne(document)
  console.log(result)
  return result;
}

async function find(db,database,collection,criteria){
  let dbo=db.db(database)
  let result=await dbo.collection(collection).find(criteria).toArray()
  console.log(result);
  return result;
}

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
	db=await connect()
  //console.log(db);
	console.log('mongoDB connected')
	app.listen(port,()=>{
	  console.log(`Example app listening on port ${port}`)
    find(db, "TestDB", "TestCollection", data)
	})
}
start()