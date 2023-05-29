const conn = require('./db_connection')

async function findLecturerUpcomingConsultations(personId)
{
    try {
        // Use prepared statements to sanitize inputs to protect from SQL injection attacks
        //Strip the time component out of the dates to avoid time-zone 
        //related date changes due to differences between node server local time and
        //database server time zone
        const [results] = await conn.promise().query("SELECT eb.Id, eb.eventId, eb.personId,DATE_FORMAT(Date,'%Y-%m-%d') Date, e.StartTime, e.Duration, e.Description, p.name studentName FROM event e JOIN event_booking eb on eb.eventId = e.Id JOIN person p ON p.Id = eb.personId WHERE e.PersonId = ?", [personId])
        console.log(results)
        return results
    } catch (error) {
        console.log(error)
    }
}

async function allConsultations(personId)
{
    try {
        //Strip the time component out of the dates to avoid time-zone 
        //related date changes due to differences between node server local time and
        //database server time zone
        const [results] = await conn.promise().query("SELECT e.Id, e.PersonId, e.DOW, DATE_FORMAT(StartDate,'%Y-%m-%d') StartDate,DATE_FORMAT(EndDate,'%Y-%m-%d') EndDate, StartTime, EndTime, Duration, SlotsPerDay, Description  FROM event e WHERE PersonId = ?", [personId])
        //console.log(results)
        return results
    } catch (error) {
        console.log(error)
    }
}

module.exports = {findLecturerUpcomingConsultations, allConsultations}