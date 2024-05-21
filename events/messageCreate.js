import { handleCommandGemini } from '../commands/gemini.js';
import { handleMsgDelete } from '../commands/msgDelete.js';
import { handleCommandProdia } from '../commands/prodia.js';
import { handleCommandProdiaImagem } from '../commands/prodiaImagem.js';
import { genAI, prodiaAI } from '../config.js';
import { handleCommandsRiotGames } from '../commands/riotGames.js'; // Importe a função handleCommandsRiotGames

export const handleMessageCreate = async (message) => {
    if (message.author.bot || !message.guild) return;

    const content = message.content.trim();
    const args = content.split(' ');

    if (message.channel.name.toLowerCase() === "scripto" && args[0].startsWith("!gemini")) {
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
    
    if (message.channel.name.toLowerCase() === "league-of-legends" && args[0] === "!perfil") {
        await handleCommandsRiotGames(message, args.slice(1)); // Chame a função handleCommandsRiotGames passando os argumentos após "!perfil"
    }
};
