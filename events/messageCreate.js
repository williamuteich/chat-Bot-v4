import { genAI, prodiaAI, app } from '../config.js';
import { getFirestore, collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { handleCommandGemini } from '../commands/gemini.js';
import { handleMsgDeleteAll } from '../commands/msgDeleteAll.js';
import { handleCommandProdia } from '../commands/prodia.js';
import { handleCommandProdiaImagem } from '../commands/prodiaImagem.js';
import { handlemsgDelete } from '../commands/msgDelete.js';

const db = getFirestore(app);
let isRegistering = false; // Variável para controlar o registro

const checkUserRegistration = async (userID) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("UserID", "==", userID));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
};

export const registerUser = async (message) => {
    if (isRegistering) return; // Verifica se já está em processo de registro
    isRegistering = true; // Define que está em processo de registro

    const filter = (m) => !m.author.bot && m.author.id === message.author.id;
    const collector = message.channel.createMessageCollector({ filter, time: 60000 }); // 60 segundos

    let userData = {};

    // Pergunta pelo nome do usuário
    await message.channel.send("Para se registrar, por favor, insira seu nome:");
    const nameCollector = message.channel.createMessageCollector(filter, { time: 60000 });
    nameCollector.on('collect', m => {
        const name = m.content.trim();
        if (name !== '') {
            userData.name = name;
            nameCollector.stop();
            // Após obter o nome, pede o sobrenome
            askLastName();
        } else {
            message.channel.send("Nome inválido. Por favor, insira um nome válido.");
        }
    });

    const askLastName = async () => {
        await message.channel.send("Agora, insira seu sobrenome:");
        const lastNameCollector = message.channel.createMessageCollector(filter, { time: 60000 });
        lastNameCollector.on('collect', m => {
            const lastName = m.content.trim();
            if (lastName !== '') {
                userData.lastName = lastName;
                lastNameCollector.stop();
                // Após obter o sobrenome, pede o número de telefone
                askPhoneNumber();
            } else {
                message.channel.send("Sobrenome inválido. Por favor, insira um sobrenome válido.");
            }
        });
    };

    const askPhoneNumber = async () => {
        await message.channel.send("Por fim, insira seu número de telefone celular com DDD (ex: 551234567890):");
        const phoneCollector = message.channel.createMessageCollector(filter, { time: 60000 });
        phoneCollector.on('collect', m => {
            userData.phoneNumber = m.content.trim();
            phoneCollector.stop();
            // Após obter o número de telefone, registra o usuário
            register(userData, message);
        });
    };

    const register = async (userData, message) => {
        const serverID = message.guild.id;
        const registrationDate = new Date().toISOString();

        // Salva os dados do usuário no Firestore
        await addDoc(collection(db, "users"), {
            UserID: message.author.id,
            Name: userData.name,
            LastName: userData.lastName,
            PhoneNumber: userData.phoneNumber,
            ServerID: serverID,
            RegistrationDate: registrationDate
        });
        message.channel.send("Você foi registrado com sucesso!");
        isRegistering = false; // Reinicia a variável de controle de registro
    };

    collector.on('end', async collected => {
        if (collected.size < 3) {
            message.channel.send("Registro cancelado. Você não forneceu todas as informações necessárias.");
            isRegistering = false; // Reinicia a variável de controle de registro
        }
    });
};

export const handleMessageCreate = async (message) => {
    if (message.author.bot || !message.guild) return;

    const content = message.content.trim();
    const args = content.split(' ');
    const userID = message.author.id;
    const isUserRegistered = await checkUserRegistration(userID);

    if (!isUserRegistered && args[0].startsWith('!')) {
        return registerUser(message);
    }

    if (message.channel.name.toLowerCase() === "scripto" && args[0].startsWith("!gemini")) {
        if (args[0] && !args[1]) return message.channel.send("!gemini Digite o seu prompt.");
        await handleCommandGemini(message, genAI);
    }

    if (args[0] === '!msgDeleteAll') {
        handleMsgDeleteAll(message);
    }

    if (args[0] === "!msgDelete") {
        if (args[0] && !args[1]) return message.channel.send("Você precisa passar a quantidade de mensagens que deseja excluir.");
        handlemsgDelete(message)
    }

    if (message.channel.name.toLowerCase() === "image-ai" && args[0] === "!prodia") {
        if (args[0] && !args[1]) return message.channel.send("!prodia Digite o seu prompt.");
        await handleCommandProdia(message, prodiaAI);
    }

    if (message.channel.name.toLowerCase() === "image-ai" && args[0] === "!prodiaUp") {
        if (args[0] && !args[1]) return message.channel.send("!prodiaUp Digite o seu Prompt.");
        await handleCommandProdiaImagem(message, prodiaAI);
    }
};
