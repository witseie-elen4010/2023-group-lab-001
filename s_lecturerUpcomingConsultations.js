const conn = require('./db_connection')

async function findLecturerUpcomingConsultations(personId, filter)
{
    try {
        // Use prepared statements to sanitize inputs to protect from SQL injection attacks
        //Strip the time component out of the dates to avoid time-zone 
        //related date changes due to differences between node server local time and
        //database server time zone
        let [results] = []
        if (filter === "All")
            [results] = await conn.promise().query("SELECT eb.Id, eb.eventId, eb.personId,DATE_FORMAT(Date,'%Y-%m-%d') Date, e.StartTime, e.Duration, e.Description, p.name studentName FROM event e JOIN event_booking eb on eb.eventId = e.Id JOIN person p ON p.Id = eb.personId WHERE e.PersonId = ? ORDER BY StartDate, StartTime", [personId])
        else if (filter === "Previous")
            [results] = await conn.promise().query("SELECT eb.Id, eb.eventId, eb.personId,DATE_FORMAT(Date,'%Y-%m-%d') Date, e.StartTime, e.Duration, e.Description, p.name studentName FROM event e JOIN event_booking eb on eb.eventId = e.Id JOIN person p ON p.Id = eb.personId WHERE e.PersonId = ? AND StartDate < ? ORDER BY StartDate, StartTime", [personId, new Date().toISOString().slice(0,10)])    
        else
            [results] = await conn.promise().query("SELECT eb.Id, eb.eventId, eb.personId,DATE_FORMAT(Date,'%Y-%m-%d') Date, e.StartTime, e.Duration, e.Description, p.name studentName FROM event e JOIN event_booking eb on eb.eventId = e.Id JOIN person p ON p.Id = eb.personId WHERE e.PersonId = ? AND StartDate >= ? ORDER BY StartDate, StartTime", [personId, new Date().toISOString().slice(0,10)])    
        //console.log(results)
        return results
    } catch (error) {
        console.error('Error retrieving consultation bookings:', error)
        throw error
    }
}

async function allConsultations(personId, filter)
{
    try {
        //Strip the time component out of the dates to avoid time-zone 
        //related date changes due to differences between node server local time and
        //database server time zone
        let [results] = []
        if (filter === "All")
            [results] = await conn.promise().query("SELECT e.Id, e.PersonId, e.DOW, DATE_FORMAT(StartDate,'%Y-%m-%d') StartDate,DATE_FORMAT(EndDate,'%Y-%m-%d') EndDate, StartTime, EndTime, Duration, SlotsPerDay, Description  FROM event e WHERE PersonId = ? ORDER BY StartDate, StartTime", [personId])
        else if (filter === "Previous")
            [results] = await conn.promise().query("SELECT e.Id, e.PersonId, e.DOW, DATE_FORMAT(StartDate,'%Y-%m-%d') StartDate,DATE_FORMAT(EndDate,'%Y-%m-%d') EndDate, StartTime, EndTime, Duration, SlotsPerDay, Description  FROM event e WHERE PersonId = ? AND StartDate < ? ORDER BY StartDate, StartTime", [personId, new Date().toISOString().slice(0,10)])
        else
            [results] = await conn.promise().query("SELECT e.Id, e.PersonId, e.DOW, DATE_FORMAT(StartDate,'%Y-%m-%d') StartDate,DATE_FORMAT(EndDate,'%Y-%m-%d') EndDate, StartTime, EndTime, Duration, SlotsPerDay, Description  FROM event e WHERE PersonId = ? AND StartDate >= ? ORDER BY StartDate, StartTime", [personId, new Date().toISOString().slice(0,10)])
        //console.log(results)
        return results
    } catch (error) {
        console.error('Error retrieving consultation events:', error)
        throw error
    }
}

module.exports = {findLecturerUpcomingConsultations, allConsultations}