const path = require('path');
const express = require('express');
const mainRouter = express.Router();
const login = require('./s_login');
const signup = require('./s_signup');
const app = express();

mainRouter.use('/', express.static(path.join(__dirname, 'public', 'resources')));
app.use(express.json()); // This line is very important

mainRouter.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'signup_login.html'));
});

mainRouter.get('/lecturer_dashboard', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'lecturer_dashboard.html'));
});

mainRouter.get('/student_portal_page', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'student_portal_page.html'));
});

//Route to handle signup POST
mainRouter.post('/signup', async function (req, res) {
  res.type('application/json');
  const result = await signup.addUser(req.body.name, req.body.email, req.body.password, req.body.role);
  res.send(result);
});


//Route to handle login POST
mainRouter.post('/login', async function (req, res) {
  res.type('application/json');
  //login is the MODULE we defined in login.js, and checkCredentials public by exporting it from login.js
  const result = await login.checkCredentials(req.body.email, req.body.password);
  res.send(result);

});

module.exports = mainRouter;
