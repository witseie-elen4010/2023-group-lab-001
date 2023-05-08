const path = require('path');
const express = require('express');
const mainRouter = express.Router();

mainRouter.use('/', express.static(path.join(__dirname, 'public')));

mainRouter.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

mainRouter.get('/signup_login', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'signup_login.html'));
});

mainRouter.get('/dashboard', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

mainRouter.get('/student_portal_page', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'student_portal_page.html'));
});

module.exports = mainRouter;
