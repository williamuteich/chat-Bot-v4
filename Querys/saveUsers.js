const dbConnection = require('../database/discordDatabase').client;

async function salvarRegistros({ userDiscord, serverIdDiscord, serverNameDiscord, email, name, last_name, cpf, phone }) {
    const createdAt = new Date();
    const session = dbConnection.startSession();
    session.startTransaction();

    try {
        const db = dbConnection.db();
        const userCollection = db.collection('users');
        const serversCollection = db.collection('servers');
        const userServersCollection = db.collection('user_servers');

        await userCollection.insertOne(
            { discordUserID: userDiscord, email, name, last_name, cpf, phone, active: true, createdAt: createdAt, updatedAt: createdAt},
            { session }
        );
        await serversCollection.insertOne(
            { discordServerID: serverIdDiscord, serverName: serverNameDiscord },
            { session }
        );
        await userServersCollection.insertOne(
            { userId: userDiscord, serverId: serverIdDiscord, credits: 5 },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        return { success: true, message: "Usuário, servidor e associação criados com sucesso." };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        console.error('Erro ao criar usuário, servidor e associação:', error);
        return { success: false, message: "Erro ao criar usuário, servidor e associação." };
    }
}

module.exports = salvarRegistros;
