const express = require('express');
const path = require('path');
const app = express();

//Database stuff
const mysql = require('mysql');
const fs = require('fs');

//Serve static files from the public directory
app.use(express.static('public'))

//Configure Database Connection
var config =
{
    host: 'group001labserver.mysql.database.azure.com',
    user: 'consulta_app',
    password: 'consultaAppALJE4',
    database: 'consulta_db',
    port: 3306,
    ssl: {ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")}
};

const conn = new mysql.createConnection(config);

conn.connect(
    function (err) { 
    if (err) { 
        console.log("!!! Cannot connect !!! Error:");
        throw err;
    }
    else
    {
       console.log("Connection established.");
           //queryDatabase();
    }
});

const mainRouter = require('./mainRoutes');
const port = process.env.PORT || 3000;

app.use(mainRouter);

app.listen(port, () => {
  console.log('Express server running on port', port);
});
