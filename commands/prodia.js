export async function handleCommandProdia(message, prodiaAI) {
    const pegaPergunta = message.content;
    let prompt = pegaPergunta.substring(pegaPergunta.indexOf(" ") + 1);
  
    const negativePrompt = "blurry, bad quality";
    const model = "absolutereality_v181.safetensors [3d9d4d2b]";

    try {
        const generatingMessage = await message.channel.send("Gerando imagem...");

        const job = await prodiaAI.generate({
            prompt,
            negativePrompt,
            model
        });

        const { imageUrl, status } = await prodiaAI.wait(job);

        if (status === 'succeeded') {
            console.log(`URL da imagem gerada: ${imageUrl}`);
            await generatingMessage.delete(); 
            await message.channel.send(`Aqui está sua imagem: ${imageUrl}`);
        } else {
            console.log(`O job ainda está em andamento. Status: ${status}`);
            await generatingMessage.delete(); 
            await message.reply("Aguarde um momento enquanto a imagem está sendo gerada.");
        }
    } catch (error) {
        console.error('Erro ao gerar a imagem:', error);
        await message.reply("Houve um erro ao gerar a imagem.");
    }
}
