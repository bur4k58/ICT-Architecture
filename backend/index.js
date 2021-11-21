const security = require("../backend/security");
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const port = 8080
const app = express()
const data = [];
app.use(bodyParser.json());

var __dirname = require('../front-end')

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.post('/post', (req, res) => {
  console.log(req.body)
  res.send(req)
});

app.post('/registration', async(req, res) => {
  const params = req.body;
  security.registerUser(params.email, params.password);
  await res.send(params)
});

app.post('/login', async(req, res) => {
  const params = req.body;
  const token = security.login(params.email, params.password);
  console.log(token)
  await res.send(params);
});

app.listen(port, () => {
  console.log('Example app listening at http://localhost:8080')
});