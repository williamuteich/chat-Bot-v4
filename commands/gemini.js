const messageWithTimestamps = {
    questions: [],
    responses: []
};

export async function handleCommandGemini(message, genAI) {
    const pegaPergunta = message.content;
    let prompt = pegaPergunta.substring(pegaPergunta.indexOf(" ") + 1);
    let processingMessage; 

    try {
        processingMessage = await message.channel.send("Gerando Resposta..."); 

        const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        const chunkSize = 1999;
        const chunks = [];
        for (let i = 0; i < text.length; i += chunkSize) {
            chunks.push(text.substring(i, i + chunkSize));
        }

        // Armazenar a pergunta original
        messageWithTimestamps.questions.push({
            message: message,
            timestamp: new Date().getTime()
        });

        for (let i = 0; i < chunks.length; i++) {
            const sentMessage = await message.channel.send(chunks[i]);
            messageWithTimestamps.responses.push({
                message: sentMessage,
                timestamp: new Date().getTime()
            });
            await new Promise(resolve => setTimeout(resolve, 500)); 
        }

        await processingMessage.edit("Resposta: ");

        messageWithTimestamps.responses.push({
            message: processingMessage,
            timestamp: new Date().getTime()
        });

    } catch (error) {
        console.error("Erro ao executar o comando Gemini:", error);
        await message.channel.send("Ocorreu um erro ao gerar a resposta. Tente novamente mais tarde.");

        if (processingMessage) {
            await processingMessage.delete().catch(console.error); 
        }
    }
}

function checkAndDeleteMessages() {
    const now = new Date().getTime();
    const deleteInterval = 60000; // 5 segundos em milissegundos

    // Verificar e excluir respostas
    for (let i = messageWithTimestamps.responses.length - 1; i >= 0; i--) {
        const messageInfo = messageWithTimestamps.responses[i];
        const elapsedTime = now - messageInfo.timestamp;

        if (elapsedTime >= deleteInterval) {
            messageInfo.message.delete().catch(console.error); 
            messageWithTimestamps.responses.splice(i, 1); 
        }
    }

    // Verificar e excluir perguntas
    for (let i = messageWithTimestamps.questions.length - 1; i >= 0; i--) {
        const messageInfo = messageWithTimestamps.questions[i];
        const elapsedTime = now - messageInfo.timestamp;

        if (elapsedTime >= deleteInterval) {
            messageInfo.message.delete().catch(console.error); 
            messageWithTimestamps.questions.splice(i, 1); 
        }
    }
}

setInterval(checkAndDeleteMessages, 60000); // Verifica a cada 5 segundos
