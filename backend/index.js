const security = require("../backend/security");
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const AWS = require('aws-sdk');
const axios = require('axios');
const {v4} = require('uuid');

const port = 8080
const app = express()
const data = [];
app.use(express.json());


/////////////S3
const bucketName = "gif-project4";
const s3 = new AWS.S3();

// viewed at http://localhost:8080
app.get('/gelukt', function(req, res) {
  console.log("Gelukt")
});

app.get('/getuploadurl', (req, res) => {
  const objectId = v4();
  console.log('return upload with objectId: ', objectId)
  const generateUrl = generatePutUrl(objectId);
  res.json(generateUrl);
});

app.post('/signaluploadcomplete', (req, res) => {
  const {uploadUrls} = req.body;

  const objectIds = uploadUrls.map(uploadUrl => extractObjectId(uploadUrl));

  const inputImageUrls = objectIds.map(objectId => generateGetUrl(objectId));

  const outputObjectId = v4();
  console.log("Output object id: ", outputObjectId)
  const outputImageUrl = generatePutUrl(outputObjectId, 'image/gif');

  axios,post('https://msw31oj97f.execute-api.eu-west-1.amazonaws.com/Prod/generate/gif',{
    inputImageUrls,
    outputObjectId
  },
  {headers: {
    'x-api-key': 'SIdHi3lzwma61h4GeBGR96ZD4rpsa3mb6iKVlMG7'
  }})
    .then(function (res) {
      res.json(outputObjectId)
    })
    .catch(function(error) {
      res.status(500).json(error);
    });
});

function extractObjectId(url) {
  const urlWithOutParams = url.split('?')[0];
  const splitUrlInSplashes = urlWithOutParams.split('/');
  return splitUrlInSplashes[splitUrlInSplashes.length -1];
}

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

app.listen(port, () => {
  console.log('Example app listening at http://localhost:8080')
});