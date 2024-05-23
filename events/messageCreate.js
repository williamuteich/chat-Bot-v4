import { handleCommandGemini } from '../commands/gemini.js';
import { handleMsgDeleteAll } from '../commands/msgDeleteAll.js';
import { handleCommandProdia } from '../commands/prodia.js';
import { handleCommandProdiaImagem } from '../commands/prodiaImagem.js';
import { handlemsgDelete } from '../commands/msgDelete.js';
import { genAI, prodiaAI } from '../config.js';

export const handleMessageCreate = async (message) => {
    if (message.author.bot || !message.guild) return;

    const content = message.content.trim();
    const args = content.split(' ');

    if (message.channel.name.toLowerCase() === "scripto" && args[0].startsWith("!gemini")) {
        if (args[0] && !args[1]) return message.channel.send("!gemini Digite o seu prompt.");
        await handleCommandGemini(message, genAI);
    }

    if (args[0] === '!msgDeleteAll') {
        handleMsgDeleteAll(message);
    }

    if (args[0] === "!msgDelete") {
        if (args[0] && !args[1]) return message.channel.send("Você precisa passar a quantidade de menssagem que deseja excluir.");
        handlemsgDelete(message)
    }

    if (message.channel.name.toLowerCase() === "image-ai" && args[0] === "!prodia") {
        if (args[0] && !args[1]) return menssage.channel.send("!prodia Digite o seu prompt.");
        await handleCommandProdia(message, prodiaAI);
    }

    if (message.channel.name.toLowerCase() === "image-ai" && args[0] === "!prodiaUp") {
        if (args[0] && !args[1]) return message.channel.send("!prodiaUp Digite o seu Prompt.");
        await handleCommandProdiaImagem(message, prodiaAI);
    }
};
