const dbConnection = require('../database/discordDatabase');

async function salvarRegistros({ userDiscord, serverIdDiscord, serverNameDiscord, email, name, last_name, cpf, phone }) {
    const conn = await dbConnection();
    try {
        await conn.beginTransaction();

        // Inserir usuário na tabela users
        const [userResult] = await conn.query(
            `INSERT INTO users (discord_user_id, email, name, last_name, cpf, phone_number) VALUES (?, ?, ?, ?, ?, ?)`,
            [userDiscord, email, name, last_name, cpf, phone]
        );

        if (userResult.affectedRows === 0) {
            await conn.rollback();
            return { success: false, message: "Erro ao inserir usuário." };
        }

        // Obter server_id da tabela servers
        let [serverResult] = await conn.query(
            `SELECT id FROM servers WHERE discord_server_id = ?`,
            [serverIdDiscord]
        );

        let serverId;
        if (serverResult.length === 0) {
            // Se o servidor não existir, inseri-lo
            const [insertServerResult] = await conn.query(
                `INSERT INTO servers (discord_server_id, server_name) VALUES (?, ?)`,
                [serverIdDiscord, serverNameDiscord]
            );
            if (insertServerResult.affectedRows === 0) {
                await conn.rollback();
                return { success: false, message: "Erro ao inserir servidor." };
            }
            serverId = insertServerResult.insertId;
        } else {
            serverId = serverResult[0].id;
        }

        // Inserir associação na tabela user_servers
        const [userServerResult] = await conn.query(
            `INSERT INTO user_servers (user_id, server_id, credits) VALUES (?, ?, ?)`,
            [userResult.insertId, serverId, 5]
        );

        if (userServerResult.affectedRows === 0) {
            await conn.rollback();
            return { success: false, message: "Erro ao associar usuário ao servidor." };
        }

        await conn.commit();
        console.log("Usuário inserido com sucesso e associado ao servidor!");
        return { success: true, message: "Usuário inserido com sucesso!" };

    } catch (error) {
        await conn.rollback();
        if (error.code === 'ER_DUP_ENTRY') {
            console.error('Usuário já registrado:', error);
            return { success: false, message: "Usuário já registrado." };
        } else {
            console.error('Erro ao inserir usuário:', error);
            return { success: false, message: "Erro ao inserir usuário." };
        }
    }
}

module.exports = salvarRegistros;
