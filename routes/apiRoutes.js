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

router.post('/data', async (req, res) => {
  console.log("<DATABASE POST>");
  api.httpRequest.POST(req, (postResponse) => {
    res.writeHead(200,{'Content-Type':'application/json'});
    res.write(postResponse, 'utf8');
    res.end();
  });
});

router.put('/data/:param', async (req, res) => {
  console.log("<DATABASE POST>");
  // api.httpRequest.PUT(req, req.params["param"], (putResponse) => {
  //   res.writeHead(200,{'Content-Type':'application/json'});
  //   res.write(putResponse, 'utf8');
  //   res.end();
  // });
  db=await connect()
  let dbo=db.db("TestDB");
  let body = '';
  req.on('data', (chunk) => {
      body += chunk.toString();
  });
  req.on('end', async () => {
    console.log(JSON.parse(body));
    let result = await dbo.collection(req.params["param"]).insertOne(JSON.parse(body));
    res.send(result);
  });
});

router.delete('/data', (req, res) => {
  let deleteResponse = api.httpRequest.DELETE(url_components);
  res.writeHead(200,{'Content-Type':'application/json'});
  res.write(deleteResponse, 'utf8');
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