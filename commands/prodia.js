const { SlashCommandBuilder } = require('discord.js');
const { createProdia } = require('prodia');
const dotenv = require('dotenv')

dotenv.config()
const { TOKEN_PRODIA } = process.env

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prodia')
        .setDescription('Gera uma imagem de alta qualidade conforme o prompt fornecido pelo usuário.')
        .addStringOption(option =>
            option.setName('prompt')
                .setDescription('Prompt para gerar a imagem.')
                .setRequired(true)),

    async execute(interaction) {
        try {
            const prompt = interaction.options.getString('prompt');

            const prodia = createProdia({ apiKey: TOKEN_PRODIA });

            await interaction.reply("Gerando imagem...");

            const job = await prodia.generate({
                model: 'amIReal_V41.safetensors [0a8a2e61]',
                prompt,
                negativePrompt: 'badly drawn',
                steps: 20,
                style_preset: 'photographic',
                cfg_scale: 7,
                seed: -1,
                upscale: true,
                sampler: 'DPM++ 2M Karras',
                width: 512,
                height: 512
            });

            const { imageUrl, status } = await prodia.wait(job);

            if (status === 'succeeded') {
                await interaction.editReply(`Aqui está sua imagem: ${imageUrl}`);
            } else {
                console.log(`O job ainda está em andamento. Status: ${status}`);
                await interaction.editReply("Aguarde um momento enquanto a imagem está sendo gerada.");
            }
        } catch (error) {
            console.error("Erro ao executar o comando prodia:", error);
            await interaction.editReply('Ocorreu um erro ao tentar gerar a imagem.');
        }
    }
}
