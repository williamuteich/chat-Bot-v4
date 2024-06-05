// users.js
const connection = require('../database/discordDatabase');

const getAllUsers = async (discordUserId) => {
    try {
        const query = 'SELECT * FROM users WHERE discord_user_id = ?';
        return new Promise((resolve, reject) => {
            connection.query(query, [discordUserId], (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    } catch (error) {
        console.error('Erro ao buscar usuários por Discord User ID:', error);
        throw error;
    }
};

module.exports = {
  getAllUsers,
};
