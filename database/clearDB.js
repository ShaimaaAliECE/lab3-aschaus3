const { createDBConnection, users, doodleSlots } = require('./DBVariables');

// create the connection
const conn = createDBConnection();

// connect to the db
conn.connect();

// drop users table if it already exists
conn.query(`DROP TABLE ${users};`, (err) => {
  if (err) throw err;

  // success message
  console.log(`Dropped ${users} table`);
});

// drop doodleSlots table if it already exists
conn.query(`DROP TABLE ${doodleSlots};`, (err) => {
  if (err) throw err;

  // success message
  console.log(`Dropped ${doodleSlots} table`);
});

// end the connection
conn.end();
