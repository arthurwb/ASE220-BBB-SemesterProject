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
});

// Serve user.html
router.get('/user', (req,res) => {
  console.log("<CREATE EDIT USER PAGE>");
  res.sendFile(path.join(__dirname, '../views', 'user.html'));
});

//Serve profile.html
router.get('/profile', (req,res) => {
  console.log("<PROFILE PAGE>");
  res.sendFile(path.join(__dirname, '../views', 'profile.html'));
});

//Serve Terms&Conditions.html
router.get('/Terms&Conditions', (req,res) => {
  console.log("<TERMS AND CONDITIONS PAGE>");
  res.sendFile(path.join(__dirname, '../views', 'Terms&Conditions.html'));
});

//Serve header.html
router.get('/header', (req,res) => {
  console.log("<HEADER DIV>");
  res.sendFile(path.join(__dirname, '../views', 'header.html'));
});

//Serve footer.html
router.get('/footer', (req,res) => {
  console.log("<FOOTER DIV>");
  res.sendFile(path.join(__dirname, '../views', 'footer.html'));
});

//Serve aboutUs.html
router.get('/aboutUs', (req,res) => {
  console.log("<ABOUT US PAGE>");
  res.sendFile(path.join(__dirname, '../views', 'aboutUs.html'));
});

//Route wildcard
router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../views', 'errorPage.html'));
});

module.exports = router;