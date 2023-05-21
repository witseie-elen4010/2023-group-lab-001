const path = require('path')
const express = require('express')
const mainRouter = express.Router()
const login = require('./s_login')
const events = require('./s_student_page')
const signup = require('./s_signup')
const dashboard = require('./s_dash')
const app = express()

mainRouter.use('/', express.static(path.join(__dirname, 'public', 'resources')))

// mainRouter.use(express.json())
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

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

// Route to handle signup POST
mainRouter.post('/signup', async function (req, res) {
  res.type('application/json')

  const result = await signup.addUser(req.body.name, req.body.email, req.body.password, req.body.role)

  if (result.status === 'Valid') {
    // Create a JWT with email and role
    console.log(req.body);
    const token = jwt.sign({ email: req.body.email, role: req.body.role }, 'consultaKey', { expiresIn: '1h' });

    // Set the JWT in an HttpOnly cookie
    res.cookie('token', token, { httpOnly: true });
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
    const token = jwt.sign({ email: req.body.email, site: result.href }, 'consultaKey', { expiresIn: '1h' });


    // Set the JWT in an HttpOnly cookie
    res.cookie('token', token, { httpOnly: true });
  }

  res.send(result)
})

function authMiddleware(requiredRole) {
  return function (req, res, next) {
    const token = req.cookies.token;

    if (!token) {
      return res.redirect('/'); // Redirect to the signup_login page
    }

    try {
      const decoded = jwt.verify(token, 'consultaKey');
      if (decoded.site === './student_portal_page') { foundRole = 'student'; }
      else if (decoded.site === './lecturer_dashboard')
      { foundRole = 'teacher'; }
      else { foundRole = decoded.role; }
      
      // Check if user role matches the required role
      if (requiredRole && foundRole !== requiredRole) {
        return res.redirect('/'); // Redirect to the signup_login page
      }

      req.user = decoded;
      next(); // Proceed to the route handler
    } catch (error) {
      return res.redirect('/'); // Redirect to the signup_login page
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
  try {
    const { eventId, personId, Date } = req.body
    await events.addEventBooking(eventId, personId, Date)
    res.json({ status: 'Success', message: 'Event booked successfully.' })
  } catch (err) {
    console.error('Error booking event:', err)
    res.json({ status: 'Error', message: 'Failed to book event.' })
  }
})

// Route to handle dashboard POST
mainRouter.post('/dashboard', authMiddleware('teacher'), async function (req, res) {
  res.type('application/json')
  const { dow, startDate, endDate, startTime, endTime, duration,  recurringWeeks, maxConsultStudents, description } = req.body
  const result = await dashboard.createConsultation(dow, startDate, endDate, startTime, endTime, duration,  recurringWeeks, maxConsultStudents, description)

  res.send(result)
})

module.exports = mainRouter

