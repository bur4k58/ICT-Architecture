const security = require("../backend/security");
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const port = 8080
const app = express()
const data = [];
app.use(bodyParser.json());

var path = require('path');

// viewed at http://localhost:8080
app.get('/gelukt', function(req, res) {
  console.log("Gelukt")
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
  security.login(params.email, params.password)
    .then((loginRes) => res.status(200).json(loginRes))
    .catch((err) => res.status(404).json(err))
});

app.post('/validatetoken', async(req, res) => {
  const params = req.body;
  security.validateToken(params.token)
    .then((tokenRes) => res.status(200).json(tokenRes))
    .catch((err) => res.status(404).json(err))
});

app.listen(port, () => {
  console.log('Example app listening at http://localhost:8080')
});