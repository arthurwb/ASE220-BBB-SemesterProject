const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

// Serve index.html
router.get('/', (req, res) => {
  console.log("<INDEX PAGE>");
  res.sendFile(path.join(__dirname, '../views', 'index.html'));
});

// Serve post.html
router.get('/post', (req, res) => {
  console.log("<USER POST PAGE>");
  res.sendFile(path.join(__dirname, '../views', 'post.html'));
})

// Serve user.html
router.get('/user', (req,res) => {
  console.log("<CREATE EDIT USER PAGE>");
  res.sendFile(path.join(__dirname, '../views', 'user.html'));
})

// Route API
router.get('/api', (req, res) => {
  res.send("api data");
});

module.exports = router;