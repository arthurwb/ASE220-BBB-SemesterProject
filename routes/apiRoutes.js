const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const api = require('../api/apiHandler');

router.get('/api/:param', (req, res) => {
  let getResponse = api.httpRequest.GET(req.params["param"]);
  res.writeHead(200,{'Content-Type':'application/json'});
  res.write(getResponse, 'utf8');
  res.end();
}).post('/api', (req, res) => {
  let params = req.params;
  res.send("api data");
}).put('/api', (req, res) => {
  let params = req.params;
  res.send("api data");
}).delete('/api', (req, res) => {
  let params = req.params;
  res.send("api data");
});

module.exports = router;