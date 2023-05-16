const path = require('path')
const express = require('express')
const mainRouter = express.Router()
const login = require('./s_login')
const events = require('./s_student_page')

mainRouter.use('/', express.static(path.join(__dirname, 'public', 'resources')))

mainRouter.use(express.json())

mainRouter.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

mainRouter.get('/signup_login', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'signup_login.html'))
})

mainRouter.get('/dashboard', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'lecturer_dashboard.html'))
})

mainRouter.get('/student_portal_page', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'student_portal_page.html'))
})

// Route to handle login POST
mainRouter.post('/login', async function (req, res) {
  res.type('application/json')
  // login is the MODULE we defined in login.js, and checkCredentials public by exporting it from login.js
  const result = await login.checkCredentials(req.body.userName, req.body.password)
  res.send(result)
})

mainRouter.get('/events', async function (req, res) {
  try {
    const result = await events.getAllEvents()
    res.json({ status: 'Valid', events: result })
  } catch (err) {
    console.error('Error retrieving events: (R)', err)
    res.json({ status: 'Error', message: 'Failed to retrieve events.' })
  }
})

mainRouter.post('/event_booking', async function (req, res) {
  try {
    const { eventId, personId, Date } = req.body
    const result = await events.addEventBooking(eventId, personId, Date)
    res.json({ status: 'Success', message: 'Event booked successfully.' })
  } catch (err) {
    console.error('Error booking event:', err)
    res.json({ status: 'Error', message: 'Failed to book event.' })
  }
})

module.exports = mainRouter
