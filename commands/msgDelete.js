const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('msgdelete')
        .setDescription('Deleta todas as mensagens do canal/uma quantidade especifica de mensagens.')
        .addStringOption(option =>
            option.setName('opcional')
                .setDescription('A quantidade de mensagens a serem deletadas.')
                .setRequired(false)
        ),

    async execute(interaction) {
        let deletedCount = 0; // Definir aqui para acessibilidade

        try {
            const channel = interaction.channel;
            const messages = await channel.messages.fetch();
            const messageCount = messages.size;

            const parametro = interaction.options.getString('opcional');
            const qtdMsgParam = parseInt(parametro);

            if (!isNaN(qtdMsgParam) && qtdMsgParam > 0) {
                const messagesToDelete = Array.from(messages.values()).slice(0, qtdMsgParam);
                deletedCount = messagesToDelete.length;
                await channel.bulkDelete(messagesToDelete);
            } else {
                while (deletedCount < messageCount) {
                    const messagesToDelete = Array.from(messages.values()).slice(deletedCount, deletedCount + 100);
                    await channel.bulkDelete(messagesToDelete);
                    deletedCount += messagesToDelete.length;
                }
            }

            await interaction.reply(`Foram deletadas ${deletedCount} mensagens.`);

        } catch (error) {
            console.log("Erro ao executar o comando msgdelete:", error);
            if (!interaction.replied) {
                await interaction.reply('Ocorreu um erro ao tentar obter as mensagens.');
            } else {
                await interaction.followUp('Ocorreu um erro ao tentar obter as mensagens.');
            }
        }
    }
}
