export async function handleCommandGemini(message, genAI) {
    const pegaPergunta = message.content;
    let prompt = pegaPergunta.substring(pegaPergunta.indexOf(" ") + 1);

    try {
        const processingMessage = await message.channel.send("Gerando Resposta...");

        const model = await genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = await response.text();

        const chunks = text.match(/(.|[\r\n]){1,1999}/g);

        if (chunks && chunks.length > 0) {
            await processingMessage.edit(`Resposta:\n${chunks[0]}`);
        }

        // Envia cada parte restante como uma mensagem separada
        for (let i = 1; i < chunks.length; i++) {
            await message.channel.send(chunks[i]);
        }

    } catch (error) {
        console.error("Erro ao executar o comando Gemini:", error);
    }
}
