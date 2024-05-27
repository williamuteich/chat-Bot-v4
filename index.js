import { Client, GatewayIntentBits } from "discord.js";
import { handleReady } from './events/ready.js';
import { handleMessageCreate } from './events/messageCreate.js';


const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ]
});

discordClient.once('ready', () => handleReady(discordClient));
discordClient.on('messageCreate', handleMessageCreate);
//discordClient.on('interaction', embedCard);

discordClient.login(process.env.TOKEN_BOT).catch(console.error);
