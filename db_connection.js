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
    waitForConnections: true,
    connectionLimit:10,
    maxIdle:10,
    idleTimeout:60000,
    queueLimit:0,
    port: 3306,
    ssl: {ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")}
};

const pool = new mysql.createPool(config);

module.exports = pool;