
const { DBConnection, times, timeSlots } = require('./DBVariables');
const util = require('util');


// Gets page info
async function getPageData() 
{

  const conn = DBConnection();
  conn.connect();
  const query = util.promisify(conn.query).bind(conn);
  let timesEntries, timeEntries;

  //Getting rows from times
  timesEntries = await query(`SELECT * FROM ${times};`);

  //Getting rows from timeSlots
  timeEntries = await query(`SELECT * FROM ${timeSlots};`);

  conn.end();
  return { timesEntries: timesEntries, timeEntries: timeEntries };
  
}

//Updates the time slots from the Admin page
async function updateTimeSlots(newTimeSlots) 
{
  const conn = DBConnection();
  conn.connect();
  const query = util.promisify(conn.query).bind(conn);

    for (let key in newTimeSlots) 
    {
      if (newTimeSlots[key]) 
      {
        await query(`UPDATE ${timeSlots} SET SlotValue = '${newTimeSlots[key]}' WHERE SlotName = '${key}';`);
      }
    }
  
  conn.end();
  return;
}

//Let the functions be called in other files
module.exports = {
  getPageData: getPageData,
  updateTimeSlots: updateTimeSlots
};

