import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

config();

const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const genAI = new GoogleGenerativeAI(process.env.TOKEN_GEMINI);

discordClient.on('ready', () => {
    console.log(`o bot iniciou como ${discordClient.user.tag}`);
});

discordClient.on('messageCreate', async (message) => {
    //console.log("Evento messageCreate disparado");

    if (message.author.bot || !message.guild || message.channel.name.toLowerCase() !== "scripto") return;
    if (message.content.startsWith("!gemini")) {
        const pegaPergunta = message.content;
        let prompt = pegaPergunta.substring(pegaPergunta.indexOf(" ") + 1);

        prompt += " (. Me mande somente no máximo 2000 caracteres e em português, não pode ultrapassar disso a tua resposta.)";

        try {
            const processingMessage = await message.channel.send("Gerando Resposta...");

            const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = await response.text();

            // Verifica se o texto é maior que 2000 caracteres
            if (text.length > 2000) {
                processingMessage.edit("A resposta gerada é muito longa para ser exibida aqui.");
            } else {
                // Envia a resposta do Gemini de volta ao canal do Discord
                processingMessage.edit(text);
            }
        } catch (error) {
            console.error("Erro ao executar o comando Gemini:", error);
        }
    }
});

discordClient.login(process.env.TOKEN_BOT).catch(console.error);
