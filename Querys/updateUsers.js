const dbConnection = require('../database/discordDatabase').client;

async function updateRegistros(name, last_name, email, cpf, phone, userDiscord) {
    try {
        const db = dbConnection.db();
        const userCollection = db.collection('users');

        console.log("Tipo de userDiscord:", typeof(userDiscord));

        // Verifique se o usuário existe no banco de dados
        const existingUser = await userCollection.findOne({ discordUserID: userDiscord });
        console.log("existingUser:", existingUser);
        console.log("userDiscord:", userDiscord);

        if (!existingUser) {
            return { success: false, message: 'Usuário não encontrado para atualização.' };
        }

        // Atualize os dados do usuário no banco de dados
        await userCollection.updateOne(
            { discordUserID: userDiscord },
            {
                $set: {
                    email,
                    name,
                    last_name,
                    cpf,
                    phone,
                    updatedAt: new Date()
                }
            }
        );

        return { success: true, message: 'Dados do Usuário Atualizados com Sucesso.' };
    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        return { success: false, message: 'Erro ao atualizar dados do usuário.' };
    }
}

module.exports = updateRegistros;
