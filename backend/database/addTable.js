const mysql = require('mysql');
const pool = mysql.createPool({
    host: "les5rds.cxz9ddw6myfz.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "password",
    port: 3306

});



pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
   
    // Use the connection

    connection.query('CREATE DATABASE IF NOT EXISTS test;');
    connection.query('USE test');
    connection.query('CREATE TABLE IF NOT EXISTS gif(id int NOT NULL AUTO_INCREMENT, username varchar(30), age int, image blob, PRIMARY KEY(id));', function(error, result, fields) {
        console.log(result)
        // When done with the connection, release it.
        connection.release();
        // Handle error after the release.
        if (error) throw error;
    });

  });
