const security = require("../backend/security");
const express = require('express')
const AWS = require('aws-sdk');
const mysql = require('mysql');
const {v4: uuidv4 } = require('uuid');
const v4  = require('uuid');

const port = 8080
const app = express()
app.use(express.json());
var fileupload = require("express-fileupload");
app.use(fileupload());

const pool = mysql.createPool({
    host: "dbproject.caqmue8hvaqa.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "rootroot",
    port: 3306
});

// viewed at http://localhost:8080
app.get('/gelukt', function(req, res) {
  console.log("Gelukt")
});

/////////////S3
const bucketName = "gif-project4";
const s3 = new AWS.S3();

app.post('/upload', (req, res) => {
  const objectId = v4();
  console.log('return upload with objectId: ', objectId)
  s3.upload({
    Key: objectId,
    Bucket: bucketName,
    Body: Buffer.from(req.body.contents, 'base64'),
  }).promise().then((response) => {
    console.log(response);
    res.json({ message: objectId })
  }).catch((error) => {
    console.log(error);
  })
});

app.get('/get', (req, res) => {
  const objectId = req.body.objectId
  console.log('return file with objectId: ', objectId)
  s3.getObject({
    Key: objectId,
    Bucket: bucketName
  }).promise()
  .then((data) => (res.json({
    LastModified: data.LastModified,
    filename: objectId,
    base_contects: data.Body.toString('base64'),
  }))).catch((err) => {
    console.log(err)
  })
});

function generateGetUrl(objectId){
  return s3.getSignedUrl("getObject", {
    Key: objectId,
    Bucket: bucketName,
    Expires: 900,
  })
}

function generatePutUrl(objectId, contentType){
  return s3.getSignedUrl("putObject", {
    Key: objectId,
    Bucket: bucketName,
    Expires: 900,
    ContentType: contentType,
  })
}
//////////////////////////////////////////////////

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

//Database
app.post('/users', (req, res) => {
  pool.getConnection(function(err, connection) {
      if (err) throw err; // not connected!
     
      // Use the connection
      if(req.query.statusFeatures) {
          console.log('Request received');
          connection.connect(function(err) {
              connection.query('USE gif_div');            
              connection.query(`INSERT INTO gif_dev.gif_metadata (uuid, tijdstippen, statusFeatures) VALUES ('${req.query.uuid}', now(), '${req.query.statusFeatures}')`, function(err, result, fields) {
                  if (err) res.send(err);
                  if (result) res.send({uuid: req.query.uuid, statusFeatures: req.query.statusFeatures, tijdstippen: Date.now()});
                  if (fields) console.log(fields);
              });
          });
  
      } else {
          console.log('missing a parameter');
      }
  
    });
  });


app.listen(port, () => {
  console.log('Example app listening at http://localhost:8080')
});