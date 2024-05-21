import { Client, GatewayIntentBits } from "discord.js";
import { handleReady } from './events/ready.js';
import { handleMessageCreate } from './events/messageCreate.js';

const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

discordClient.once('ready', () => handleReady(discordClient));
discordClient.on('messageCreate', handleMessageCreate);

discordClient.login(process.env.TOKEN_BOT).catch(console.error);
