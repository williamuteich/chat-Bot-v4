async function updateRegistros({ discordUserID, email, name, last_name, cpf, phone, serverIdDiscord, serverNameDiscord }) {
    try {
        const db = dbConnection.db();
        const userCollection = db.collection('users');

        const existingUser = await userCollection.findOne({ discordUserID });

        if (!existingUser) {
            return { success: false, message: 'Usuário não encontrado para atualização.' };
        }

        const updateFields = {
            $set: {
                email,
                name,
                last_name,
                cpf,
                phone,
                serverIdDiscord,
                serverNameDiscord,
                updatedAt: new Date()
            }
        };

        await userCollection.updateOne({ discordUserID }, updateFields);

        return { success: true, message: 'Dados do Usuário Atualizados com Sucesso.' };
    } catch (error) {
        console.error('Erro ao atualizar dados do usuário:', error);
        return { success: false, message: 'Erro ao atualizar dados do usuário.' };
    }
}

module.exports = updateRegistros;
