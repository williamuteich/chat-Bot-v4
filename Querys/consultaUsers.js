const dbConnection = require('../database/discordDatabase');

const registeredUsers = {};

async function isUserRegistered(userDiscord){
    if (registeredUsers[userDiscord]) {
        console.log("registros aqui:", registeredUsers)
        return true;
    }

    const conn = await dbConnection();
    const [rows, fields] = await conn.query(`SELECT * FROM users WHERE discord_user_id = ${userDiscord}`);
    if (rows.length > 0) {
        console.log("Dados encontrados com sucesso.");
        registeredUsers[userDiscord] = true;
        return true;
    } else {
        console.log("Dados não foram encontrados.");
        return false;
    }
}

module.exports = isUserRegistered;
