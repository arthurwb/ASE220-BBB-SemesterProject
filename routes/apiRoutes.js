const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');
const api = require('../api/apiHandler');

router.get('/data/:param', (req, res) => {
  let getResponse = api.httpRequest.GET(req.params["param"]);
  res.writeHead(200,{'Content-Type':'application/json'});
  res.write(getResponse, 'utf8');
  res.end();
});

router.post('/data', (req, res) => {
  api.httpRequest.POST(req, (postResponse) => {
    res.writeHead(200,{'Content-Type':'application/json'});
    res.write(postResponse, 'utf8');
    res.end();
  });
});

router.put('/data/:param', (req, res) => {
  api.httpRequest.PUT(req, req.params["param"], (putResponse) => {
    res.writeHead(200,{'Content-Type':'application/json'});
    res.write(putResponse, 'utf8');
    res.end();
  });
});

router.delete('/data', (req, res) => {
  let deleteResponse = api.httpRequest.DELETE(url_components);
  res.writeHead(200,{'Content-Type':'application/json'});
  res.write(deleteResponse, 'utf8');
  res.end();
});

module.exports = router;