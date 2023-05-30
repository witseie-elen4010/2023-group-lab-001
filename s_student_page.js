'use strict'

const pool = require('./db_connection')

// Function to retrieve all events from the database
async function getAllEvents () {
  try {
    const events = await pool.promise().query(`SELECT p.Name AS PersonName, e.RecurringWeeks AS NumberOfWeeks, e.Description AS EventDescription, e.StartTime AS EventStartTime,  DATE_FORMAT(e.StartDate,'%Y-%m-%d') AS EventDate, e.Duration AS EventDuration, e.SlotsPerDay, e.Id AS EventId, COALESCE(eb.EventBookingCount, 0) AS EventBookingCount
                                              FROM event e
                                              JOIN person p ON e.PersonId = p.Id
                                              LEFT JOIN(
                                                    SELECT eventId, COUNT(*) AS EventBookingCount
                                                  FROM event_booking
                                                  GROUP BY eventId
                                                  ) AS eb ON e.Id = eb.eventId
                                              WHERE COALESCE(eb.EventBookingCount, 0) < e.SlotsPerDay;`) // Adjust the SQL query based on your table name and structure
    
    return events
  } catch (error) {
    console.error('Error retrieving events:', error)
    throw error
  }
}

async function getAllConsults (personId) {
  try {
    // Use prepared statements to sanitize inputs to protect from SQL injection attacks
    const query = "SELECT e.StartTime, e.Duration, DATE_FORMAT(eb.Date,'%Y-%m-%d') StartDate, e.Description, eb.eventId, eb.Id AS bookingId, p.name AS lecturerName FROM event_booking eb JOIN event e ON eb.EventId = e.Id JOIN person p ON p.Id = e.PersonId WHERE eb.personId = ?"
    const [results] = await pool.promise().query(query, [personId])
    // console.log(results)
    return results
  } catch (error) {
    console.error('Error retrieving events:', error)
    throw error
  }
}

// Function to add an event booking to the database
async function addEventBooking (eventId, personId, Date) {
  personId = parseInt(personId)
  if (!eventId || typeof eventId !== 'number') {
    throw new Error('Invalid eventId')
  }

  if (!personId || typeof personId !== 'number') {
    console.log(typeof personId)
    throw new Error('Invalid personId')
  }

  if (!Date) {
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
