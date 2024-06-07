const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Criar uma conta para utilizar o bot.'),
    async execute(interaction) {
        try {
            const modal = new ModalBuilder()
                .setCustomId('ModalRegister')
                .setTitle('Preencha o formulário com os seus dados.');

            const nomeInput = new TextInputBuilder()
                .setCustomId('nomeInput')
                .setLabel("Qual o seu nome?")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const sobrenomeInput = new TextInputBuilder()
                .setCustomId('sobrenomeInput')
                .setLabel("Qual o seu sobrenome?")
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const emailInput = new TextInputBuilder()
                .setCustomId('emailInput')
                .setLabel('Seu Email?')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const cpfInput = new TextInputBuilder()
                .setCustomId('cpfInput')
                .setLabel('CPF')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const phoneInput = new TextInputBuilder()
                .setCustomId('phoneInput')
                .setLabel('Telefone')
                .setStyle(TextInputStyle.Short)
                .setRequired(true);

            const primeiroNome = new ActionRowBuilder().addComponents(nomeInput);
            const sobrenome = new ActionRowBuilder().addComponents(sobrenomeInput);
            const emailUsuario = new ActionRowBuilder().addComponents(emailInput);
            const cpfUsuario = new ActionRowBuilder().addComponents(cpfInput);
            const secondActionRow = new ActionRowBuilder().addComponents(phoneInput);

            modal.addComponents(primeiroNome, sobrenome, emailUsuario, cpfUsuario, secondActionRow);

            await interaction.showModal(modal);
        } catch (error) {
            console.error('Erro ao iniciar registro:', error);
            await interaction.reply({ content: 'Ocorreu um erro ao iniciar o registro. Por favor, tente novamente mais tarde.', ephemeral: true });
        }
    },
};
