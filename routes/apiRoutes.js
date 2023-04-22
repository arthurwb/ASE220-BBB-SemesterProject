const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const bodyParser = require('body-parser')
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin@qb3cluster.sknm95g.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
app.use(bodyParser.json())
var db=null
const api = require('../api/apiHandler');
const databaseConnection = require('../api/databaseHandler');

router.get('/data/:param', async (req, res) => {
  console.log("<DATABASE GET>")
  db=await connect()
  // let getResponse = api.httpRequest.GET(req.params["param"], client);
  let dbo=db.db("TestDB");
  let result=await dbo.collection(req.params["param"]).find({}).toArray();
  res.send(result);
  res.end();
});

// router.post("/data/auth/login", async (req, res) => {
//   console.log("<AUTH POST>");
//   db=await connect()
//   let dbo=db.db("TestDB");
//   // check find
//   dbo.collection('Users').find({username: req.body.username, password: req.body.password}, {

//   })
// })

router.post('/data/collection/:param', async (req, res) => {
  console.log("<DATABASE POST>");

  const db = await connect();
  const dbo = db.db("TestDB");

  let collectionName = req.params["param"];
  let collectionExists = await dbo.listCollections({name: collectionName}).hasNext();

  if (collectionExists) {
    res.status(400).send(`Collection ${collectionName} already exists`);
  } else {
    await dbo.createCollection(collectionName);
    res.status(200).send(`Collection ${collectionName} created successfully`);
  }
  res.end();
});

router.put('/data/:param/:id/:type', async (req, res) => {
  console.log("<DATABASE PUT>");
  db=await connect()
  let dbo=db.db("TestDB");
  let body = '';
  req.on('data', (chunk) => {
      body += chunk.toString();
  });
  req.on('end', async () => {
    let jsonBody = JSON.parse(body)
    let result;
    if (req.params["type"] == "comment") {
      result = await dbo.collection(req.params["param"]).updateOne(
        { id: parseInt(req.params["id"]) },
        { $push: { comments: JSON.parse(body) } }
      );
    } else if (req.params["type"] == "post") {
      result = await dbo.collection(req.params["param"]).insertOne(jsonBody);
    } else if (req.params["type"] == "user") {
      result = await dbo.collection(req.params["param"]).insertOne(jsonBody);
    } else {
    }
    res.send(result);
  });
});

router.delete('/data/:param', async (req, res) => {
  const db = await connect();
  const dbo = db.db("TestDB");
  console.log(req.params["param"]);

  console.log(req.body);
  let body = '';
  req.on('data', (chunk) => {
      body = chunk.toString();
  });
  req.on('end', async () => {
    console.log(body);
    let result = await dbo.collection(req.params["param"]).deleteOne(JSON.parse(body),function(err,result){
      if (err) throw err
      console.log(result)
    });
    res.send(result);
  });
});

router.delete('/data/collection/:param', async (req, res) => {
  console.log("<DATABASE POST>");

  const db = await connect();
  const dbo = db.db("TestDB");

  let collectionName = req.params["param"];
  let collectionExists = await dbo.listCollections({name: collectionName}).hasNext();
  
  if (collectionExists) {
    await dbo.dropCollection(collectionName);
    res.status(200).send(`Collection ${collectionName} successfully deleted`);
  } else {
    res.status(400).send(`Collection ${collectionName} does not exists`);
  }
  res.end();
});

async function connect(){
	let connection=await client.connect()
	return connection
}

async function find(db,database,collection,criteria){
  let dbo=db.db(database)
  let result=await dbo.collection(collection).find(criteria).toArray()
  console.log(result)
  return result;
}

async function databaseConnect() {
  db=await connect()
  //console.log(db);
	console.log('mongoDB connected')
}

module.exports = router;