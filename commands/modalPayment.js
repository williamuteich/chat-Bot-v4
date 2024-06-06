const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setDescription('Inicia o processo de pagamento via PIX.'),

        async execute(interaction) {
            try {
                const modal = new ModalBuilder()
                .setCustomId('pagamentoPix')
                .setTitle('Pagamento via PIX');
        
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
            
            const hobbiesInput = new TextInputBuilder()
                .setCustomId('hobbiesInput')
                .setLabel("Descrição do produto")
                .setStyle(TextInputStyle.Paragraph);
        
            const primeiroNome = new ActionRowBuilder().addComponents(nomeInput);
            const sobrenome = new ActionRowBuilder().addComponents(sobrenomeInput);
            const emailUsuario = new ActionRowBuilder().addComponents(emailInput);
            const cpfUsuario = new ActionRowBuilder().addComponents(cpfInput);
            const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

            modal.addComponents(primeiroNome, sobrenome, emailUsuario, cpfUsuario, secondActionRow);

            await interaction.showModal(modal);
            
        } catch (error) {
            console.error('Erro ao iniciar pagamento via PIX:', error);
            await interaction.reply('Ocorreu um erro ao iniciar o pagamento. Por favor, tente novamente mais tarde.');
        }
    },
};