const conn = require('./db_connection')

/*async function checkInfo(dayOfmonth, startTime, recurringOptionBinary, endDate, endTime, maxConsultsDay, maxConsultsStudents, Description) {
    const date = new Date(dayOfmonth) // convert date string to day of the week. 1 for Monday, 2 for Tuesday, etc.
    const dayOfWeek = date.getDay()

    Mon = 0
    Tue = 0
    Wed = 0
    Thu = 0
    Fri = 0

    switch (dayOfWeek) {
        case 0:
            Mon = 1
            break
        case 1:
            Tue = 1
            break
        case 2:
            Wed = 1
            break
        case 3:
            Thu = 1
            break
        case 4:
            Fri = 1
            break
        default:
            break
    }

    const start = new Date(`2023-05-15T${startTime}:00`) // create date objects so can subtract timnes to get duration
    const end = new Date(`2023-05-15T${endTime}:00`)
    const duration = (end.getTime() - start.getTime()) / (1000 * 60) // time difference in minutes

    // SQL query to insert new user into the database
    PersonId = 1 // will be changed based on cookies at a later stage

    const params = [PersonId, Mon, Tue, Wed, Thu, Fri, startTime, duration, recurringOptionBinary, Description, dayOfmonth, endDate, maxConsultsDay]
    try {
        // Use prepared statements to sanitize inputs to protect from SQL injection attacks
        const [results] = await conn.promise().query('INSERT INTO event (PersonId, Mon, Tue, Wed, Thu, Fri, StartTime, Duration, Repeats, Description, FirstOccurrence, LastOccurrence, SlotsPerDay) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', params)
        console.log(results)
    } catch (error) {
        console.log(error)
    }
}

module.exports = { checkInfo }*/

async function createConsultation(dow, startDate, endDate, startTime, endTime, duration, recurringWeeks, maxConsultStudents, description) {
    personId = 1
    const params = [personId, dow, startDate, endDate, startTime, endTime, duration, recurringWeeks, maxConsultStudents, description]

    try {
        // Use prepared statements to sanitize inputs to protect from SQL injection attacks
        const [results] = await conn.promise().query('INSERT INTO event (PersonId, DOW, StartDate, EndDate, StartTime, EndTime, Duration, RecurringWeeks, SlotsPerDay, Description) VALUES (?,?,?,?,?,?,?,?,?,?)', params)
        console.log(results)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {createConsultation}
