const mysql = require('mysql2');

const config = require('../config/config');

const pool = mysql.createPool({
    host: config.host,
    database: config.database,
    user: config.username,
    password: config.password
});

module.exports = pool.promise();