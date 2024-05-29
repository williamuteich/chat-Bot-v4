const { SlashCommandBuilder } = require('discord.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.TOKEN_GEMINI);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gemini')
        .setDescription('Use o modelo Gemini para gerar uma resposta.')
        .addStringOption(option => 
            option.setName('prompt')
                .setDescription('A pergunta ou prompt para o modelo Gemini.')
                .setRequired(true)
        ),

    async execute(interaction) {
        try {
            const prompt = interaction.options.getString('prompt');

            await interaction.deferReply({ ephemeral: true });

            const model = await genAI.getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            const maxLength = 1999;
            const textParts = [];

            for (let i = 0; i < text.length; i += maxLength) {
                textParts.push(text.substring(i, i + maxLength));
            }

            await interaction.followUp({ content: textParts[0], ephemeral: true });

            for (let i = 1; i < textParts.length; i++) {
                await interaction.followUp({ content: textParts[i], ephemeral: true });
            }

        } catch (error) {
            console.error('Erro ao executar o comando Gemini:', error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'Ocorreu um erro ao tentar obter a resposta.', ephemeral: true });
            } else {
                await interaction.followUp({ content: 'Ocorreu um erro ao tentar obter a resposta.', ephemeral: true });
            }
        }
    },
};
