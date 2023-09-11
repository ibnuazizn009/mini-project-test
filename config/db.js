'use strict';

const dotenv = require('dotenv');
const mysql = require('mysql');

dotenv.config();

const PORT = process.env.PORT;

const sql = mysql.createConnection({
    host: process.env.MYSQL_SERVER,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
});

sql.connect(function (err) {
    if(err){
        console.log("error");
    }else{
        console.log("connected");
    }
});

module.exports = {
    port: PORT,
    sql
}