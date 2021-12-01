const express = require('express')
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "les5rds.cxz9ddw6myfz.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "password",
    port: 3306

});

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
 res.json('Hello world!');
});




app.post('/users', (req, res) => {
    if(req.query.username && req.query.age) {
        console.log('Request received');
        connection.connect(function(err) {
            connection.query(`INSERT INTO test.gif (username, age, image) VALUES ('${req.query.username}', '${req.query.age}', '${req.query.image}')`, function(err, result, fields) {
                if (err) res.send(err);
                if (result) res.send({username: req.query.username, age: req.query.age, image: req.query.image,});
                if (fields) console.log(fields);
            });

        });

    } else {
        console.log('missing a parameter');
    }
});

app.get('/users', (req, res) => {
    connection.connect(function(err) {
        connection.query(`SELECT * FROM test.gif`, function(err, result, fields) {
            if (err) res.send(err);
            if (result) res.send(result);
        });
    });
});


app.listen(3000, () => {
 console.log('Started api on http://localhost:3000');
})

