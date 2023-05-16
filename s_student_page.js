'use strict'

const pool = require('./db_connection')

// Function to retrieve all events from the database
async function getAllEvents () {
  try {
    const events = await pool.promise().query('SELECT p.Name AS PersonName, e.Description AS EventDescription, e.StartTime AS EventStartTime, e.FirstOccurrence AS EventDate, e.Duration AS EventDuration, e.Id AS EventId FROM event e JOIN person p ON e.PersonId = p.Id;') // Adjust the SQL query based on your table name and structure
    return events
  } catch (error) {
    console.error('Error retrieving events:', error)
    throw error
  }
}

// Function to add an event booking to the database
async function addEventBooking (eventId, personId, Date) {
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
  addEventBooking
}
