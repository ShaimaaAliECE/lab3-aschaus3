
const DBConnection = require('./dbConnection');
const { users, times, timeSlots } = require('./DBVariables'); //Getting the variables
const conn = DBConnection();


conn.connect();


//Dropping all the tables if they exist
conn.query(`DROP TABLE IF EXISTS ${users};`, (err) => {
  if (err) 
    throw err;
});


conn.query(`DROP TABLE IF EXISTS ${times};`, (err) => {
  if (err) 
    throw err;
});

conn.query(`DROP TABLE IF EXISTS ${timeSlots};`, (err) => {
  if (err) 
    throw err;
});

//Creating all three tables
conn.query(`CREATE TABLE ${users} (Username VARCHAR(100) ,Password VARCHAR(100));`
, (err) => {
    if (err) 
      throw err;
});


conn.query(`CREATE TABLE ${times} ( Name VARCHAR(100) ,Slot1 BOOLEAN ,Slot2 BOOLEAN ,Slot3 BOOLEAN ,Slot4 BOOLEAN ,Slot5 BOOLEAN ,Slot6 BOOLEAN ,Slot7 BOOLEAN ,Slot8 BOOLEAN ,Slot9 BOOLEAN ,Slot10 BOOLEAN);`
, (err) => {
    if (err) 
      throw err;
});

conn.query(`CREATE TABLE ${timeSlots} ( SlotName VARCHAR(100) ,SlotValue VARCHAR(100)) `
, (err) => {
    if (err) 
      throw err;
});

// Adding an Admin
const adminUsers = [
  {
    "username": "Andrew",
    "password": "3316"
  }
];

// query to insert admin users from data object above
for (user of adminUsers) {
  conn.query(`INSERT INTO ${users} VALUES ('${user.username}','${user.password}');`
  , (err) => {
      if (err) 
        throw err;
  });
};

//Adding data to the timeSlots table
  conn.query(`INSERT INTO ${timeSlots} VALUES 
    ('Slot1', '8am'),
    ('Slot2', '9am'),
    ('Slot3', '10am'),
    ('Slot4', '11am'),
    ('Slot5', '12pm'),
    ('Slot6', '1pm'),
    ('Slot7', '2pm'),
    ('Slot8', '3pm'),
    ('Slot9', '4pm'),
    ('Slot10', '5pm')
  `, (err) => {
    if (err) 
      throw err;
  });

// end the connection to the DB
conn.end();
