const conn = require('./db_connection')

async function lecDeleteBooking(bookingID)
{
    try
    {
        const result = await conn.promise().query("DELETE FROM event_booking WHERE Id = ?", [bookingID])
        console.log(result)
        return {status: 'Completed'}
    }
    catch(error)
    {
        console.log(error)
    }
}

module.exports = {lecDeleteBooking}