const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');


app.use(express.json());  // For parsing application/json
//Serve static files from the public directory
app.use(express.static('public'))
app.use(cookieParser());


const mainRouter = require('./mainRoutes');
const port = process.env.PORT || 3000;

app.use(mainRouter);

app.listen(port, () => {
  console.log('Express server running on port', port);
});
