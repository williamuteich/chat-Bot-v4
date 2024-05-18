export async function handleCommandGemini(message, genAI) {
    const pegaPergunta = message.content;
    let prompt = pegaPergunta.substring(pegaPergunta.indexOf(" ") + 1);

    try {
        const processingMessage = await message.channel.send("Gerando Resposta...");

        const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        const chunkSize = 1999;
        const chunks = [];
        for (let i = 0; i < text.length; i += chunkSize) {
            chunks.push(text.substring(i, i + chunkSize));
        }

        for (let i = 0; i < chunks.length; i++) {
            await message.channel.send(chunks[i]);
            await new Promise(resolve => setTimeout(resolve, 500)); 
        }

        await processingMessage.edit("Resposta: ");

    } catch (error) {
        console.error("Erro ao executar o comando Gemini:", error);
        await message.channel.send("Ocorreu um erro ao gerar a resposta. Tente novamente mais tarde.");
    }
}
