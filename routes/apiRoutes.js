const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

router.get('/api', (req, res) => {
    let params = req.params;
    res.send("api data");
  });
  router.post('/api', (req, res) => {
    let params = req.params;
    res.send("api data");
  });
  router.put('/api', (req, res) => {
    let params = req.params;
    res.send("api data");
  });
  router.delete('/api', (req, res) => {
    let params = req.params;
    res.send("api data");
  });

  module.exports = apiRouter;