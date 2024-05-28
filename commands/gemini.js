const { SlashCommandBuilder } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");

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
            // Verificar se a interação é do tipo ChatInputCommandInteraction
            if (interaction.isCommand()) {
                const prompt = interaction.options.getString('prompt');
                
                const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                const text = await response.text();

                // Verificar se a interação ainda é válida
                if (interaction.replied || !interaction.channel || !interaction.guild) {
                    console.log("A interação não é mais válida. Ignorando resposta.");
                    return;
                }

                // Dividindo a mensagem em partes de até 1999 caracteres
                const chunks = [];
                const chunkSize = 1999;
                for (let i = 0; i < text.length; i += chunkSize) {
                    chunks.push(text.substring(i, i + chunkSize));
                }

                // Enviando as partes da mensagem separadamente
                for (const chunk of chunks) {
                    await interaction.reply(chunk);
                }
            }
        } catch (error) {
            console.error("Erro ao executar o comando Gemini:", error);
            await interaction.reply("Ocorreu um erro ao gerar a resposta. Tente novamente mais tarde.");
        }
    }
};
