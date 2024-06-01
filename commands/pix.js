const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { Payment } = require('@mercadopago/sdk-js');
const dotenv = require('dotenv');

dotenv.config();

const { TOKEN_MERCADOPAGO, TOKEN_CHAVEPIX } = process.env;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pix')
        .setDescription('Inicia o processo de pagamento via PIX.'),

        async execute(interaction) {
            try {
                const modal = new ModalBuilder()
                .setCustomId('pagamentoPix')
                .setTitle('Pagamento via PIX');
        
            const nomeInput = new TextInputBuilder()
                .setCustomId('checkout__payerFirstName')
                .setLabel("Qual o seu nome?")
                .setStyle(TextInputStyle.Short);

            const sobrenomeInput = new TextInputBuilder()
                .setCustomId('form-checkout__payerLastName')
                .setLabel("Qual o seu sobrenome?")
                .setStyle(TextInputStyle.Short);
            
            const emailInput = new TextInputBuilder()
                .setCustomId('form-checkout__email')
                .setLabel('Seu Email?')
                .setStyle(TextInputStyle.Short);
        
            const cpfInput = new TextInputBuilder()
                .setCustomId('identificationNumber')
                .setLabel('CPF')
                .setStyle(TextInputStyle.Short);
            
//
            const hobbiesInput = new TextInputBuilder()
                .setCustomId('description')
                .setLabel("Descrição do produto")
                .setStyle(TextInputStyle.Paragraph);
        
            const primeiroNome = new ActionRowBuilder().addComponents(nomeInput);
            const sobrenome = new ActionRowBuilder().addComponents(sobrenomeInput);
            const emailUsuario = new ActionRowBuilder().addComponents(emailInput)
            const cpfUsuario = new ActionRowBuilder().addComponents(cpfInput)
            const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

            modal.addComponents(primeiroNome, sobrenome, emailUsuario, cpfUsuario, secondActionRow);
        
            await interaction.showModal(modal);
        } catch (error) {
            console.error('Erro ao iniciar pagamento via PIX:', error);
            await interaction.reply('Ocorreu um erro ao iniciar o pagamento. Por favor, tente novamente mais tarde.');
        }
    },
};
