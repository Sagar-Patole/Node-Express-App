const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    database: 'express-app',
    user: 'root',
    password: 'root'
});

module.exports = pool.promise();