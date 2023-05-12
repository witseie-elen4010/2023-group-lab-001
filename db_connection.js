//Database stuff
const mysql = require('mysql2');
const fs = require('fs');

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

module.exports = conn;