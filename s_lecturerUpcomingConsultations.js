const conn = require('./db_connection')

async function findLecturerUpcomingConsultations(personId)
{
    try {
        // Use prepared statements to sanitize inputs to protect from SQL injection attacks
        const [results] = await conn.promise().query("SELECT eb.*, e.StartTime, e.Duration, p.name studentName FROM event e JOIN event_booking eb on eb.eventId = e.Id JOIN person p ON p.Id = eb.personId WHERE e.PersonId = ?", [personId])
        
        return results
    } catch (error) {
        console.log(error)
    }
}

module.exports = {findLecturerUpcomingConsultations}