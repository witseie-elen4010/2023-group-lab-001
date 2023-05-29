const conn = require('./db_connection')

async function createConsultation(personId, dow, startDate, endDate, startTime, endTime, duration, recurringWeeks, maxConsultStudents, description) {
    const params = [personId, dow, startDate, endDate, startTime, endTime, duration, recurringWeeks, maxConsultStudents, description]

    try {
        // Use prepared statements to sanitize inputs to protect from SQL injection attacks
        const [results] = await conn.promise().query('INSERT INTO event (PersonId, DOW, StartDate, EndDate, StartTime, EndTime, Duration, RecurringWeeks, SlotsPerDay, Description) VALUES (?,?,?,?,?,?,?,?,?,?)', params)
        console.log(results)
        return true
    } catch (error) {
        console.log(error)
    }
}

module.exports = { createConsultation }
