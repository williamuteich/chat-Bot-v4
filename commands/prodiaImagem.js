export async function handleCommandProdiaImagem(message, prodiaAI) {
    try {
        const attachment = message.attachments.first();
        if (!attachment) {
            throw new Error("Nenhum anexo encontrado na mensagem.");
        }

        const imageUrl = attachment.url;
        const prompt = message.content.split(' ').slice(1).join(' ');

        console.log(`Imagem URL: ${imageUrl}`);
        console.log(`Prompt: ${prompt}`);

        const negativePrompt = "blurry, max quality";
        const model = "v1-5-pruned-emaonly.safetensors [d7049739]";

        const generatingMessage = await message.channel.send("Gerando imagem...");

        const job = await prodiaAI.transform({
            imageUrl,
            prompt,
            negativePrompt,
            model,
            denoising_strength: 0.9,
            style_preset: "enhance",
            steps: 19,
            cfg_scale: 10,
            seed: -1,
            upscale: true,
            sampler: "DPM++ 2M Karras",
            width: 512,
            height: 512
        });

        const { imageUrl: generatedImageUrl, status } = await prodiaAI.wait(job);

        if (status === 'succeeded') {
            console.log(`URL da imagem gerada: ${generatedImageUrl}`);
            await generatingMessage.delete(); 
            await message.channel.send(`Aqui está sua imagem: ${generatedImageUrl}`);
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
