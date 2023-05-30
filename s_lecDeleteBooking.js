const conn = require('./db_connection')

async function lecDeleteBooking(bookingID) {
    try {
        const result = await conn.promise().query('DELETE FROM event_booking WHERE Id = ?', [bookingID])
        // console.log(result)
        return { status: 'Completed' }
    } catch (error) {
        console.error('Error deleting booking:', error)
        throw error
    }
}

async function lecDeleteEvent(eventID) {
    try {
        const result = await conn.promise().query('DELETE FROM event WHERE Id = ?', [eventID])
        // console.log(result)
        return { status: 'Completed' }
    } catch (error) {
        console.error('Error deleting consultation event:', error)
        throw error
    }
}

module.exports = { lecDeleteBooking, lecDeleteEvent }
