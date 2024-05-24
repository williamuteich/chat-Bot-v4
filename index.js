import { Client, GatewayIntentBits } from "discord.js";
import { handleReady } from './events/ready.js';
import { handleMessageCreate, registerUser } from './events/messageCreate.js';

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
discordClient.on('messageCreate', registerUser);

discordClient.login(process.env.TOKEN_BOT).catch(console.error);
