const express = require("express");
const { createDBConnection, users, doodleSlots } = require('./database/DBVariables');

// express constants
const app = express();
const router = express.Router();

// specify port number
const port = process.env.port || 8080;

// specify render engine
app.set('view engine', 'ejs');

// store user if they logged in
let currentUser = undefined;

// number of total slots available
const slotCount = 10;

// the default url path
router.get('/', (req, res) => {
  // if the user is logged in show them the other page
  if (currentUser !== undefined) {
    res.redirect('/admin-view');
    return;
  }

  res.render('index');

});

// render html for the admin login page
router.get('/login-view', (req, res) => {
  res.render('admin-login');
})

// enable reading POST data
router.use(express.urlencoded({
  extended: true
}));

// login for admin
router.post('/admin-login', (req, res) => {
  if (currentUser) {
    res.redirect('/admin-view');
    return;
  }

  let username = req.body.username;
  let password = req.body.password;

  // create a db connection
  const conn = createDBConnection();

  // connect to the db
  conn.connect();

  // query to get the user
  conn.query(`
      SELECT
        *
      FROM
        ${users}
      WHERE
        Username = \"${username}\" AND
        password = \"${password}\";
    `, (err, rows, fields) => {
        if (err) throw err;

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

  // get previous data from db connection
  const conn = createDBConnection();

  // connect to db
  conn.connect();

  // read previous data and convert to html
  conn.query(`
    SELECT
      *
    FROM
      ${doodleSlots};
    `, (err, rows, fields) => {
        if (err) throw err;

        // renders the html for the given file with the values passed to it
        res.render('guest-view',  { rows: rows, slotCount: slotCount });
  });

  // close connection
  conn.end();

  return;
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

  // create db connection
  const conn = createDBConnection();

  // connect to the db
  conn.connect();

  // insert the data in the table
  conn.query(`
      INSERT INTO ${doodleSlots}
      VALUES
        (\"${name}\", ${slots[0]}, ${slots[1]}, ${slots[2]}, ${slots[3]}, ${slots[4]}, ${slots[5]}, ${slots[6]}, ${slots[7]}, ${slots[8]}, ${slots[9]});
    `, (err) => {
      if (err) throw err;

      console.log('Insert Completed Successfully.');

      // redirect back to the page
      res.redirect('/guest');
      return;
    })

  // close the connection
  conn.end();
});

router.get('/admin-view', (req, res) => {
  // if the user is not logged in then redirect them to the home page
  if (currentUser === undefined)
  {
    res.redirect('/');
    return;
  }

  res.render('admin-view', { user: currentUser });
});

// for logging out
router.get('/logout', (req, res) => {
  currentUser = undefined;

  res.redirect('/');
  return;
});

// using router to send html pages
app.use('/', router);

// serve static files
app.use(express.static('public'));

// specify port to listen
app.listen(port);

// provide message that the server has started
console.log('Server started at http://localhost:' + port);
