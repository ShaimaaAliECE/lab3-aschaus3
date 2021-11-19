const express = require("express");
const { createDBConnection, users, times, timeSlots } = require('./database/DBVariables');
const { getPageData, updateTimeSlots } = require('./database/DBQueries');

const app = express();
const router = express.Router();
const port = process.env.port || 80;
app.set('view engine', 'ejs');

//Will store the current user
let currentUser = undefined;
const slotCount = 10;

//If there is a current user, load admin-view
router.get('/', (req, res) => 
{
  if (currentUser !== undefined) 
  {
    res.redirect('/admin-view');
    return;
  }
  res.render('index');

});

// Admin login page
router.get('/login-view', (req, res) => 
{
  res.render('admin-login');
})

router.use(express.urlencoded({
  extended: true
}));

// Admin login
router.post('/admin-login', (req, res) => {
  if (currentUser) {
    res.redirect('/admin-view');
    return;
  }

  let username = req.body.username;
  let password = req.body.password;

  
  const conn = createDBConnection();
  conn.connect();

  // query to get the user
  conn.query(`SELECT * FROM ${users} WHERE Username = \"${username}\" AND password = \"${password}\";`
      , (err, rows, fields) => {
        if (err) 
          throw err;
        if (rows.length === 1) {
          currentUser = username;
          res.redirect('/admin-view');
        } else {
          res.redirect('/admin-login');
        }
    });

  // close the connection
  conn.end();
});

router.get('/admin-login', (req, res) => {
  res.render('admin-login', { errMsg: 'Invalid Credentials!' })
});


// for use as guest login
router.get('/guest', (req, res) => {

  getPageData().then(({timeEntries, timesEntries}) => {

      res.render('guest-view',  { rows: timesEntries, slotCount: slotCount, timeSlots: timeEntries });
    
  }).catch((err) => {
    throw err;
  });
});

// for adding guest data to the database
router.get('/add-guest', (req, res) => {
  // get the name value from the form
  let name = req.query.name;

  if (!name) {
    res.redirect('/guest');
    return;
  }

  // get the slots value from the form
  let slots = [
    req.query.Slot_1 === "True" ? true : false,
    req.query.Slot_2 === "True" ? true : false,
    req.query.Slot_3 === "True" ? true : false,
    req.query.Slot_4 === "True" ? true : false,
    req.query.Slot_5 === "True" ? true : false,
    req.query.Slot_6 === "True" ? true : false,
    req.query.Slot_7 === "True" ? true : false,
    req.query.Slot_8 === "True" ? true : false,
    req.query.Slot_9 === "True" ? true : false,
    req.query.Slot_10 === "True" ? true : false
  ];

  const conn = createDBConnection();
  conn.connect();

  // insert the data in the table
  conn.query(`INSERT INTO ${times}
      VALUES (\"${name}\", ${slots[0]}, ${slots[1]}, ${slots[2]}, ${slots[3]}, ${slots[4]}, ${slots[5]}, ${slots[6]}, ${slots[7]}, ${slots[8]}, ${slots[9]});`
      , (err) => {
      if (err) 
        throw err;

      // redirect back to the page
      res.redirect('/guest');
      return;
    })
  conn.end();
});

router.get('/admin-view', (req, res) => {
  // if the user is not logged in then redirect them to the home page
  if (currentUser === undefined)
  {
    res.redirect('/');
    return;
  }

  getPageData().then(({timeEntries, timesEntries}) => {
      res.render('admin-view', {user: currentUser, timeSlots: timeEntries, rows: timesEntries, slotCount: slotCount})
    
  }).catch((err) => {
    throw err;
  });

});

// update the slots from the admin
router.get('/update-slots', async (req, res) => {
  // to prevent unauthenticated use
  if (!currentUser) {
    res.redirect('/');
    return;
  }

  // Get the values from the slots
  let slotValues = {
    "Slot1": req.query.Slot1,
    "Slot2": req.query.Slot2,
    "Slot3": req.query.Slot3,
    "Slot4": req.query.Slot4,
    "Slot5": req.query.Slot5,
    "Slot6": req.query.Slot6,
    "Slot7": req.query.Slot7,
    "Slot8": req.query.Slot8,
    "Slot9": req.query.Slot9,
    "Slot10": req.query.Slot10
  }

  // call the async function to update the values of the timeSlots table
  updateTimeSlots(slotValues).then(() => {
    res.redirect('/admin-view');
    return;

  }).catch((err) => {
    throw err;
  });
});

// for logging out
router.get('/logout', (req, res) => {
  currentUser = undefined;

  res.redirect('/');
  return;
});


app.use('/', router);
app.use(express.static('public'));
app.listen(port);
console.log('Server launched: ' + port); //Confimation message
