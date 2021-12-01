const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "les5rds.cxz9ddw6myfz.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "password",
    port: 3306

});

connection.connect(function(err) {
    if (err) throw err;

    connection.query('CREATE DATABASE IF NOT EXISTS test;');
    connection.query('USE test');
    connection.query('CREATE TABLE IF NOT EXISTS users(id int NOT NULL AUTO_INCREMENT, username varchar(30), email varchar(255), age int, PRIMARY KEY(id));', function(error, result, fields) {
    
        console.log(result);
    });
    connection.end();

  });





  

