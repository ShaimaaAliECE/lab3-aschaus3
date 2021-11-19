const conn = require('mysql'); 

//Connecting to the database
function DBConnection() {
  let connection = conn.createConnection({
    host:'34.70.248.65',
    user:'root',
    password:'3316',
    database:'Lab3' 
  });

  return connection;
}

module.exports = DBConnection;