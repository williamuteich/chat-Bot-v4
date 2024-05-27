import { getFirestore, collection, getDocs, query, where, addDoc } from "firebase/firestore";
import { app } from '../config.js';

const db = getFirestore(app);

export const checkUserRegistration = async (userID) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("userID", "==", userID));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
};

export const registerUser = async (message) => {
    const filter = (m) => !m.author.bot && m.author.id === message.author.id;

    let userData = {};

    // Pergunta pelo nome do usuário
    await handleUserName(message, userData);

    // Verifica se o usuário já está registrado
    const isUserRegistered = await checkUserRegistration(message.author.id);

    if (isUserRegistered) {
        message.channel.send("Você já está registrado.");
        return;
    }

    // Se o usuário não estiver registrado, registra-o
    try {
        const { name } = userData;
        const serverID = message.guild.id;
        const userID = message.author.id;

        // Adiciona os dados do usuário ao Firestore
        const docRef = await addDoc(collection(db, "users"), {
            name,
            serverID,
            userID
        });

        console.log("Documento do usuário adicionado com ID: ", docRef.id);
        message.channel.send("Registro concluído com sucesso!");
    } catch (error) {
        console.error("Erro ao adicionar documento: ", error);
        message.channel.send("Ocorreu um erro durante o registro. Por favor, tente novamente mais tarde.");
    }
};
