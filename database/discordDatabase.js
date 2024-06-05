const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config()

const { HOST_DATABASE, USER_DATABASE, PASSWORD_DATABASE, DATABASE_NAME } = process.env;

console.log(HOST_DATABASE, USER_DATABASE, PASSWORD_DATABASE, DATABASE_NAME)

const pool = mysql.createPool({
  host: HOST_DATABASE,
  user: USER_DATABASE,
  password: PASSWORD_DATABASE,
  database: DATABASE_NAME
});

module.exports = pool;
