const path = require('path')
const express = require('express')
const mainRouter = express.Router()
const login = require('./s_login')
const events = require('./s_student_page')
const consults = require('./s_student_page')
const signup = require('./s_signup')
const dashboard = require('./s_dash')
const lecUpcomingConsults = require('./s_lecturerUpcomingConsultations')
const lecDeleteUpcomingBooking = require('./s_lecDeleteBooking')
const conn = require('./db_connection');

const app = express()

mainRouter.use('/', express.static(path.join(__dirname, 'public', 'resources')))

// mainRouter.use(express.json())
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(express.json()) // This line is very important

mainRouter.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'signup_login.html'))
})

mainRouter.get('/lecturer_dashboard', authMiddleware('teacher'), function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'lecturer_dashboard.html'))
})

mainRouter.get('/student_portal_page', authMiddleware('student'), function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'student_portal_page.html'))
})

mainRouter.get('/admin', authMiddleware('admin'), async function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'))
})


// Route to handle signup POST
mainRouter.post('/signup', async function (req, res) {
  res.type('application/json')

  const result = await signup.addUser(req.body.name, req.body.email, req.body.password, req.body.role)

  if (result.status === 'Valid') {
    // Create a JWT with email and role
    const token = jwt.sign({ email: req.body.email, role: req.body.role }, 'consultaKey', { expiresIn: '1h' })

    // Set the JWT in an HttpOnly cookie
    res.cookie('token', token, { httpOnly: true })
    res.cookie('userID', result.userID)

    // Insert action into the log
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let params;

    if (req.body.role === 'student') {
      params = [result.userID, "Student signed up", timestamp];
    } else {
      params = [result.userID, "Lecturer signed up", timestamp];
    }

    await conn.promise().query("INSERT INTO log (PersonId, Action, TimeStamp) VALUES (?, ?, ?)", params);
  }

  res.send(result)
})

// Route to handle login POST
mainRouter.post('/login', async function (req, res) {
  res.type('application/json')
  // login is the MODULE we defined in login.js, and checkCredentials public by exporting it from login.js
  const result = await login.checkCredentials(req.body.email, req.body.password)

  if (result.status === 'Valid') {
    // Create a JWT with email and role
    const token = jwt.sign({ email: req.body.email, site: result.href }, 'consultaKey', { expiresIn: '1h' })

    // Set the JWT in an HttpOnly cookie
    res.cookie('token', token, { httpOnly: true })

    res.cookie('userID', result.userID)

    // Insert action into the log
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let params;

    // check if user is admin
    if (req.body.email === 'admin@wits.ac.za' && req.body.password === 'admin') {
      params = [result.userID, "Admin logged in", timestamp];
      res.cookie('role', 'admin');
    } else if (result.href === './student_portal_page') {
      params = [result.userID, "Student logged in", timestamp];
    } else {
      params = [result.userID, "Lecturer logged in", timestamp];
    }

    await conn.promise().query("INSERT INTO log (PersonId, Action, TimeStamp) VALUES (?, ?, ?)", params);

  }

  res.send(result)
})


function authMiddleware(requiredRole) {
  return function (req, res, next) {
    const token = req.cookies.token

    if (!token) {
      return res.redirect('/') // Redirect to the signup_login page
    }

    try {
      const decoded = jwt.verify(token, 'consultaKey')
      if (decoded.site === './student_portal_page') { foundRole = 'student' }
      else if (decoded.site === './lecturer_dashboard') { foundRole = 'teacher' }
      else if (decoded.site === './admin') { foundRole = 'admin' }
      else { foundRole = decoded.role }

      res.cookie('role', foundRole)

      // Check if user role matches the required role
      if (requiredRole && foundRole !== requiredRole) {
        return res.redirect('/') // Redirect to the signup_login page
      }

      req.user = decoded
      next() // Proceed to the route handler
    } catch (error) {
      return res.redirect('/') // Redirect to the signup_login page
    }
  }
}


mainRouter.get('/events', authMiddleware('student'), async function (req, res) {
  try {
    const result = await events.getAllEvents()
    res.json({ status: 'Valid', events: result })
  } catch (err) {
    console.error('Error retrieving events: (R)', err)
    res.json({ status: 'Error', message: 'Failed to retrieve events.' })
  }
})

mainRouter.post('/event_booking', authMiddleware('student'), async function (req, res) {
  personId = req.cookies.userID
  try {
    const { eventId, Date: eventDate } = req.body
    await events.addEventBooking(eventId, personId, eventDate)
    // Log the action
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const params = [personId, "Student booked event", timestamp];
    await conn.promise().query("INSERT INTO log (PersonId, Action, TimeStamp) VALUES (?, ?, ?)", params);

    res.json({ status: 'Success', message: 'Event booked successfully.' })
  } catch (err) {
    console.error('Error booking event:', err)
    res.json({ status: 'Error', message: 'Failed to book event.' })
  }
})

mainRouter.get('/consults', authMiddleware('student'), async function (req, res) {
  const userID = req.cookies.userID
  try {
    res.type('application/json')
    const results = await consults.getAllConsults(userID)
    res.send(results)
  } catch (err) {
    console.error('Error retrieving consults: (R)', err)
    res.json({ status: 'Error', message: 'Failed to retrieve events.' })
  }
})

mainRouter.post('/studentDeleteBooking', authMiddleware('student'), async function (req, res) {
  res.type('application/json')
  const bookingID = req.body.bookingID
  const result = await lecDeleteUpcomingBooking.lecDeleteBooking(bookingID)
  // Log the action
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const params = [req.cookies.userID, "Student deleted booking", timestamp];
  await conn.promise().query("INSERT INTO log (PersonId, Action, TimeStamp) VALUES (?, ?, ?)", params);
  res.send(result)
})


// Route to handle dashboard POST
mainRouter.post('/dashboard', authMiddleware('teacher'), async function (req, res) {
  userID = req.cookies.userID
  res.type('application/json')
  const { dow, formattedStartDate, endDate, startTime, endTime, duration, recurringWeeksSet, maxConsultStudents, description } = req.body
  const result = await dashboard.createConsultation(userID, dow, formattedStartDate, endDate, startTime, endTime, duration, recurringWeeksSet, maxConsultStudents, description)

  // Log the action
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

  const params = [userID, "Lecturer created a consultation", timestamp];

  await conn.promise().query("INSERT INTO log (PersonId, Action, TimeStamp) VALUES (?, ?, ?)", params);
  //Delete duplicate log entries
  await conn.promise().query(`
        DELETE FROM log 
        WHERE (PersonId, Action, TimeStamp) IN 
            (SELECT PersonId, Action, TimeStamp
            FROM (
                SELECT PersonId, Action, TimeStamp,
                ROW_NUMBER() OVER(PARTITION BY PersonId, Action, TimeStamp ORDER BY PersonId) AS RowNum
                FROM log
            ) t
            WHERE t.RowNum > 1)
    `);

  res.send(result)
})

mainRouter.get('/lecturerUpcomingConsultations', authMiddleware('teacher'), async function (req, res) {
  userID = req.cookies.userID
  res.type('application/json')

  const results = await lecUpcomingConsults.findLecturerUpcomingConsultations(userID)
  res.send(results)
})

mainRouter.post('/lecDeleteBooking', authMiddleware('teacher'), async function (req, res) {
  res.type('application/json')
  const bookingID = req.body.bookingID
  const result = await lecDeleteUpcomingBooking.lecDeleteBooking(bookingID)

  // Log the action
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const params = [req.cookies.userID, "Lecturer deleted a booking", timestamp];
  await conn.promise().query("INSERT INTO log (PersonId, Action, TimeStamp) VALUES (?, ?, ?)", params);

  res.send(result)
})

mainRouter.get('/logout', async function (req, res) {
  // Log the action
  const userID = req.cookies.userID;
  const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
  const action = req.cookies.role === 'student' ? "Student logged out" :
    req.cookies.role === 'admin' ? "Admin logged out" :
      "Lecturer logged out";
  const params = [userID, action, timestamp];
  await conn.promise().query("INSERT INTO log (PersonId, Action, TimeStamp) VALUES (?, ?, ?)", params);
  // Clear the token cookie
  res.clearCookie('token');
  res.clearCookie('userID');
  // Redirect to the signup_login page
  return res.redirect('/');
});

mainRouter.get('/logData', async function (req, res) {
  try {
    const [rows, fields] = await conn.promise().query(
      `SELECT p.Name, p.Role, l.Action, l.TimeStamp 
       FROM log l
       INNER JOIN person p ON l.PersonId = p.Id
       ORDER BY l.TimeStamp DESC`
    );
    res.send(rows);
  } catch (err) {
    console.error('Error retrieving log data:', err);
    res.send([]);
  }
});



module.exports = mainRouter
