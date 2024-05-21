import { Client, GatewayIntentBits } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createProdia } from 'prodia';

import { config } from "dotenv";

import { handleCommandGemini } from './commands/gemini.js';
import { handleMsgDelete } from './commands/msgDelete.js';
import { handleCommandProdia } from './commands/prodia.js';
import { handleCommandProdiaImagem } from './commands/prodiaImagem.js';

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
const prodiaAI = createProdia({
    apiKey: process.env.TOKEN_PRODIA
});

discordClient.on('ready', () => {
    console.log(`o bot iniciou como ${discordClient.user.tag}`);
});

discordClient.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild) return;

    const content = message.content.trim();
    const args = content.split(' ');

    if (message.channel.name.toLowerCase() === "scripto" && content.startsWith("!gemini")) {
        await handleCommandGemini(message, genAI);
    }

    if (args[0] === '!msgDelete') {
        handleMsgDelete(message);
    }

    if (message.channel.name.toLowerCase() === "image-ai" && args[0] === "!prodia") {
        await handleCommandProdia(message, prodiaAI);
    }

    if (message.channel.name.toLowerCase() === "image-ai" && args[0] === "!prodiaUp") {
        await handleCommandProdiaImagem(message, prodiaAI);
    }
});

discordClient.login(process.env.TOKEN_BOT).catch(console.error);
