const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config()

const { HOST_DATABASE, USER_DATABASE, PASSWORD_DATABASE, DATABASE_NAME } = process.env;


async function dbConnection() {
  if (global.connection && global.connection.state !== 'disconnected') {
    console.log("Reutilizando Conexão")
    return global.connection;
  }

  const connection = await mysql.createConnection({
    host: "localhost",
    user: "usuario",
    password: "40028922",
    database: "botDiscordV14-DB"
  });
  
  console.log("conectou no MySQL")
  global.connection = connection;
  return connection;
}

dbConnection();

module.exports = dbConnection;
