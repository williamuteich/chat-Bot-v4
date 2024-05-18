import { config } from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { handleCommandGemini } from './commands/gemini.js';
import  { handleMsgDelete } from './commands/msgDelete.js'

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
    if (message.author.bot || !message.guild || message.channel.name.toLowerCase() !== "scripto") return;
    if (message.content.startsWith("!gemini")) {
        await handleCommandGemini(message, genAI);
    }
});

discordClient.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;
    const args = message.content.split(' ');

    if (args[0] === '!msgDelete') {
        handleMsgDelete(message);
    }
});

discordClient.login(process.env.TOKEN_BOT).catch(console.error);