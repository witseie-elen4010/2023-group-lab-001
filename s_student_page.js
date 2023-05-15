'use strict'

const conn = require('./db_connection')

// async function AddEventBookings (userName) {
//   console.log('AddEVentBookings is being executed')
//   const eventBookingData = {
//     eventId: 1,
//     personId: 1,
//     Date: '2023-05-15'
//   }

//   // const sql = 'INSERT INTO event_booking (eventId, personId, Date) VALUES (?, ?, ?)'
//   // const values = [eventBookingData.eventId, eventBookingData.personId, eventBookingData.Date]
//   const values = ['temp']

//   const sql = 'SELECT * FROM event'

//   conn.query(sql, values, (err, results) => {
//     if (err) {
//       console.error('Error inserting event_booking:', err)
//       return
//     }
//     console.log('Event_booking inserted successfully.')
//   })
//   return { href: './student_portal_page', status: 'Valid' }
// }

// // Function to retrieve all events from the "events" table
// function getAllEvents () {
//   return new Promise((resolve, reject) => {
//     const sql = 'SELECT * FROM event'

//     conn.query(sql, (err, results) => {
//       if (err) {
//         console.error('Error retrieving events:', err)
//         reject(err)
//         return
//       }

//       resolve(results)
//     })
//   })
// }

// module.exports = {
//   getAllEvents
// }

// module.exports = { AddEventBookings }

// Function to retrieve all events from the database
async function getAllEvents () {
  try {
    const events = await conn.promise().query('SELECT * FROM event') // Adjust the SQL query based on your table name and structure
    return events
  } catch (error) {
    console.error('Error retrieving events:', error)
    throw error
  }
}

// Export the getAllEvents function to be used in mainRoutes.js
module.exports = {
  getAllEvents
}
