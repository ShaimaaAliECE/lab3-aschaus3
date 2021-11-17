const mysql = require('mysql');

function createDBConnection() {
  let connection = mysql.createConnection({
    host:'34.70.248.65',
    user:'root',
    password:'3316',
    database:'Lab3' 
  });

  return connection;
}

module.exports = createDBConnection;
