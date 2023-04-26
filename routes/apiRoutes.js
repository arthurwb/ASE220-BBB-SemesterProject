/* EXPRESS */
const express=require('express');
const cookieParser=require('cookie-parser');
const router=express();

/* BODY PARSER */
const bodyParser = require('body-parser');

/* MONGODB */
const {MongoClient}=require('mongodb')
const uri = "mongodb+srv://admin:admin@qb3cluster.sknm95g.mongodb.net/?retryWrites=true&w=majority";
const client= new MongoClient(uri)
const ObjectId = require('mongodb').ObjectId
var database=null;
var db = null;

/* BCRYPT ENCRYPTION */
const bcrypt=require('bcrypt')

/* JWT AUTH */
const jwt=require('jsonwebtoken')
const jwt_expiration=86400000
const jwtsalt='privatekey'
const salt='$2b$10$Imnq7Q2r0RS7DqaKV0rpPe'

/* Middleware */
router.use(express.static('public'))
router.use(bodyParser.json())
router.use(cookieParser())

/* SEARCH BAR */
router.get('/data/search/', async (req,res)=>{
  db = await connect();
  database = db.db("TestDB");
  for (let key in req.query) {
    if (req.query.hasOwnProperty(key)) {
      if (req.query[key] === 'null') {
        req.query = {};
      }
    }
  }
  // console.log(req.query);

  let search = await database.collection('Posts').find(req.query).toArray()

  res.send(search);
})

/* API GET ROUTES */
router.get("/data/unAuth/:param", async (req, res) => {
  console.log("<API DECRYPT>");
  console.log(req.params["param"]);
  db=await connect()
  let dbo=db.db("TestDB");

  let cookie = req.params["param"];
  let username = await dbo.collection("Users").find({jwt: cookie},{username: 1}).toArray();
  console.log(username[0]);
  res.send(username[0]);
  res.end();
})

router.get('/data/:param', async (req, res) => {
  console.log("<API GET>");
  db=await connect();
  let dbo=db.db("TestDB");
  let result=await dbo.collection(req.params["param"]).find({}).toArray();
  res.send(result);
  res.end();
});

router.get('/data/getitem/:collection/:id', async (req, res) => {
  console.log("<API ITEM GET>");
  let id = req.params["id"].toString();
  console.log(id);
  db = await connect();
  let dbo = db.db("TestDB");
  let result = await dbo.collection(req.params["collection"]).find({_id:new ObjectId(id)}).toArray();
  console.log(result);
  res.json(result);
  res.end();
})

router.get('/data/getuserid/:collection/:username', async (req, res) => {
  console.log("<API ITEM USER ID>");
  db = await connect();
  let dbo = db.db("TestDB");
  let result = await dbo.collection(req.params["collection"]).find({username: req.params.username},).toArray();
  console.log(result);
  res.json(result);
  res.end();
})

/* API POST ROUTES */

router.post('/data/auth/signup', async (req,res)=>{
  console.log("<API AUTH SIGNUP POST>");
  db = await connect();
  database = db.db("TestDB");

	let test = await database.collection('Users').find({username:req.body.username},{username:1}).toArray();

  if (test.length > 0) {
    res.status(406).json({message:'User already exists'});
  }

  else {
    req.body.password=bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')

    await database.collection('Users').insertOne(req.body,function(err,result){
      if (err) throw err
      res.status(201).json({message:'User created'})
    })
  }
})

router.post('/data/auth/signin', async (req,res)=>{
  console.log("<API AUTH SIGNIN POST>");
  db = await connect();
  database = db.db("TestDB");

	let user = await database.collection('Users').find({username:req.body.username},{_id:1,username:1,password:1}).toArray();

  if (user.length == 0) {
    res.status(406).json({message:'User is not registered'})
  }

  else {
    if (user[0].password!=bcrypt.hashSync(req.body.password,salt).replace(`${salt}.`,'')) {
      res.status(406).json({message:'Wrong password'})
    }

    else {
      let userId=user[0]._id.toString().replace('New ObjectId("','').replace('")','');
      let token=jwt.sign({id:userId},jwtsalt,{expiresIn:jwt_expiration});
      
      await database.collection('Users').updateOne({_id:new ObjectId(userId)},{$set:{jwt:token}});

      res.status(200).setHeader('Authorization', `Bearer ${token}`).json({message:'User authenticated'});
    }
  }
})

router.post('/data/collection/:param', async (req, res) => {
  console.log("<API COLLECTION POST>");

  db = await connect();
  let dbo = db.db("TestDB");

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

/* API PUT ROUTES */
router.put('/data/:param/:id/:type', async (req, res) => {
  console.log("<API POST/COMMENT PUT>");
  db=await connect();
  let dbo=db.db("TestDB");

  if (req.params["type"] == "comment") {
    result = await dbo.collection(req.params["param"]).updateOne(
      { id: parseInt(req.params["id"]) },
      { $push: { comments: req.body } }
    );
  } else if (req.params["type"] == "post") {
    result = await dbo.collection(req.params["param"]).insertOne(req.body);
  } else {
    console.log("incorrect type entered");
  } 
res.send(result);
});

/* API DELETE ROUTES */
router.delete('/data/:param', express.json(), async (req, res) => {
  console.log("<API DELETE>")
  db = await connect();
  let dbo = db.db("TestDB");

  let result = await dbo.collection(req.params["param"]).deleteOne(req.body, function(err, result) {
    if (err) throw err
  });
  res.send(result);
});

router.delete('/data/collection/:param', async (req, res) => {
  console.log("<API COLELCTION DELETE>");

  db = await connect();
  let dbo = db.db("TestDB");

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

/* ROUTE FUNCTIONS */
async function find(db,database,collection,criteria){
  let dbo=db.db(database);
  let result=await dbo.collection(collection).find(criteria).toArray();
  return result;
}

/* CONNECT TO DATABASE */
async function connect(){
	let connection=await client.connect();
	return connection;
}

module.exports = router;