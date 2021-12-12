const express = require('express');
const mysql = require('mysql');
const pool = mysql.createPool({
    host: "les5rds.cxz9ddw6myfz.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "password",
    port: 3306

});

const {v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
 res.json('Hello world!');
});


app.post('/users', (req, res) => {
pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Use the connection
    if(req.query.statusFeatures) {
        console.log('Request received');
        connection.connect(function(err) {
            connection.query('USE gif_div');            
            connection.query(`INSERT INTO gif_dev.gif_metadata (uuid, tijdstippen, statusFeatures) VALUES ('${uuidv4()}', now(), '${req.query.statusFeatures}')`, function(err, result, fields) {
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







app.get('/users', (req, res) => {
    pool.getConnection(function(err, connection) {
        connection.query(`SELECT * FROM gif_dev.gif_metadata`, function(err, result, fields) {
            if (err) res.send(err);
            if (result) res.send(result);
        });
    });
});


app.listen(3000, () => {
 console.log('Started api on http://localhost:3000');
})


