const express=require('express')
const bodyParser = require('body-parser')
const cookieParser=require('cookie-parser');
const router=express()

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:admin@qb3cluster.sknm95g.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const ObjectId = require('mongodb').ObjectId

const bcrypt=require('bcrypt')

const jwt=require('jsonwebtoken')
const jwt_expiration=86400000
const jwtsalt='privatekey'

const salt='$2b$10$Imnq7Q2r0RS7DqaKV0rpPe'

var database=null;

/* Middleware */
router.use(express.static('public'))
router.use(bodyParser.json())
router.use(cookieParser())

router.post('/data/auth/signup',(req,res)=>{
	console.log(req.body)
	database.collection('Users').find({username:req.body.username},{username:1}).toArray(function(err, result){
		if (err) throw err
		if(result.length>0) res.status(406).json({message:'User already exists'})
		else{
			req.body.password=bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')
			database.collection('Users').insertOne(req.body,function(err,result){
				if (err) throw err
				res.status(201).json({message:'User created'})
			})
		}
	})
})

router.post('/data/auth/signin',(req,res)=>{
	database.collection('Users').find({username:req.body.username},{_id:1,username:1,password:1}).toArray(function(err, result){
		console.log(result)
		if (err) throw err
		if(result.length==0) res.status(406).json({message:'User is not registered'})
		else{
			if(result[0].password!=bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')) return res.status(406).json({message:'Wrong password'})
			else{
				userId=result[0]._id.toString().replace('New ObjectId("','').replace('")','')
				console.log(userId)
				let token=jwt.sign({id:userId},jwtsalt,{expiresIn:jwt_expiration})
				database.collection('Users').updateOne({_id:ObjectId(userId)},{$set:{jwt:token}},function(err,result){
					if (err) throw err
					res.status(200).setHeader('Authorization', `Bearer ${token}`).json({message:'User authenticated'})
				})
			}
		}
	})
})

router.get('/data/:param', async (req, res) => {
  console.log("<DATABASE GET>")
  db=await connect()
  // let getResponse = api.httpRequest.GET(req.params["param"], client);
  let dbo=db.db("TestDB");
  let result=await dbo.collection(req.params["param"]).find({}).toArray();
  res.send(result);
  res.end();
});

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

router.delete('/data/:param', express.json(), async (req, res) => {
  const db = await connect();
  const dbo = db.db("TestDB");
  console.log(req.params["param"]);

  console.log("before delete"+ JSON.stringify(req.body));

  let result = await dbo.collection(req.params["param"]).deleteOne(req.body, function(err, result) {
    if (err) throw err
    console.log("after delete"+result)
  });
  res.send(result);
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