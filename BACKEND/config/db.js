const mysql = require('mysql2/promise');

var pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'back'
});

module.exports = pool;