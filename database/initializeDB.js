// File to be executed to initialize the database with data and tables required

// import db connection creation function
const createDBConnection = require('./dbConnection');

// get variables of table names
const { users, doodleSlots } = require('./DBVariables');

// create a connection
const conn = createDBConnection();

// connect to the DB
conn.connect();

// drop table if it already exists
conn.query(`DROP TABLE IF EXISTS ${users};`, (err) => {
  if (err) throw err;

  // success message
  console.log(`Dropped ${users} table`);
});

// query to create table
conn.query(`
  CREATE TABLE ${users} (
    Username VARCHAR(100)
    ,Password VARCHAR(100)
  );
`, (err) => {
    if (err) throw err;

    // success message
    console.log(`Successfully Created ${users} table`);
});

// sample admin user data array
const adminUsers = [
  {
    "username": "Admin0",
    "pwd": "Western#0"
  },
  {
    "username": "Admin1",
    "pwd": "Western#1"
  }
];

// query to insert admin users from data object above
for (user of adminUsers) {
  conn.query(`
    INSERT INTO ${users} VALUES (
      '${user.username}'
      ,'${user.pwd}'
    );
  `, (err) => {
      if (err) throw err;

      // success message
      console.log(`Successfully added user to ${users} table`);
  });
};

// select all rows from users
conn.query(`
  SELECT
    *
  FROM
    ${users}
`, (err, rows, fields) => {
  if (err) throw err; // throw the error if any

  console.log(fields); // print the fields

  console.log(`Data from ${users} table: `);
  for (let row of rows) // print the rows returned
    console.log(row);

});

// drop table if it already exists
conn.query(`DROP TABLE IF EXISTS ${doodleSlots};`, (err) => {
  if (err) throw err;

  // success message
  console.log(`Dropped ${doodleSlots} table`);
});

// query to create table
conn.query(`
  CREATE TABLE ${doodleSlots} (
    Name VARCHAR(100)
    ,Slot1 BOOLEAN
    ,Slot2 BOOLEAN
    ,Slot3 BOOLEAN
    ,Slot4 BOOLEAN
    ,Slot5 BOOLEAN
    ,Slot6 BOOLEAN
    ,Slot7 BOOLEAN
    ,Slot8 BOOLEAN
    ,Slot9 BOOLEAN
    ,Slot10 BOOLEAN
  );
`, (err) => {
    if (err) throw err;

    // success message
    console.log(`Successfully Created ${doodleSlots} table`);
});

// end the connection to the DB
conn.end();
