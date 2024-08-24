const mysql = require('mysql2');

const config = require('../config/config');

const pool = mysql.createPool({
    host: config.database.host,
    database: config.database.database,
    user: config.database.username,
    password: config.database.password
});

module.exports = pool.promise();