'use strict'

const pool = require('./db_connection')

function isValidDate(dateString) {
  // Create a new Date object from the date string.
  const date = new Date(dateString)
  if (isNaN(date) || isNaN(date.getFullYear()) || isNaN(date.getMonth()) || isNaN(date.getDate())) {
    return false
  }
  const day = parseInt(dateString.substr(8, 2), 10)
  const ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (date.getMonth() === 2) {
    let leapYear = false
    if ((!(date.getFullYear() % 4) && date.getFullYear() % 100) || !(date.getFullYear() % 400)) {
      leapYear = true
    }
    if ((leapYear === false) && (day >= 29)) {
      return false
    } else if ((leapYear === true) && (day > 29)) {
      return false
    }
  } else if (date.getMonth() === 1 || date.getMonth() > 2) {
    if (day > ListofDays[date.getMonth() - 1]) {
      // to check if the date is out of range
      return false
    }
  }
  return true
}

// Function to retrieve all events from the database
async function getAllEvents() {
  try {
    const events = await pool.promise().query('SELECT p.Name AS PersonName, e.Description AS EventDescription, e.StartTime AS EventStartTime, e.StartDate AS EventDate, e.Duration AS EventDuration, e.Id AS EventId FROM event e JOIN person p ON e.PersonId = p.Id;') // Adjust the SQL query based on your table name and structure
    return events
  } catch (error) {
    console.error('Error retrieving events:', error)
    throw error
  }
}

async function getAllConsults(personId) {
  try {
    // Use prepared statements to sanitize inputs to protect from SQL injection attacks
    const [results] = await pool.promise().query('SELECT e.StartTime, e.StartDate, eb.eventId, eb.Id AS bookingId, p.name AS lecturerName FROM event_booking eb JOIN event e ON eb.EventId = e.Id JOIN person p ON p.Id = e.PersonId WHERE eb.personId = ?', [personId])
    // console.log(results)
    return results
  } catch (error) {
    console.log(error)
  }
}

// Function to add an event booking to the database
async function addEventBooking(eventId, personId, Date) {
  personId = parseInt(personId)
  if (!eventId || typeof eventId !== 'number') {
    throw new Error('Invalid eventId')
  }

  if (!personId || typeof personId !== 'number') {
    console.log(typeof personId)
    throw new Error('Invalid personId')
  }

  if (!Date || !isValidDate(Date)) {
    throw new Error('Invalid Date')
  }

  try {
    const result = await pool
      .promise()
      .query(
        'INSERT INTO event_booking (eventId, personId, Date) VALUES (?, ?, ?)',
        [eventId, personId, Date]
      )

    return result
  } catch (error) {
    console.error('Error adding event booking:', error)
    throw error
  }
}

// Export the getAllEvents function to be used in mainRoutes.js
module.exports = {
  getAllEvents,
  addEventBooking,
  getAllConsults
}
