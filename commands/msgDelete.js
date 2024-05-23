export async function handlemsgDelete(message){
    const args = message.content.split(" ");
    const prompt = parseInt(args[1]);

    if (isNaN(prompt) || prompt <= 0) {
        return message.channel.send("Por favor, especifique um número válido e maior que zero para a quantidade de mensagens a serem excluídas.");
    }

    const msgBody = message.channel.messages.cache.size;

    if(msgBody < prompt) return message.channel.send(`O número de mensagens do canal atual é ${msgBody + 1}`)

    message.channel.messages.fetch({ limit: prompt + 1})
    .then(messages => {
        messages.forEach(msg => {
            msg.delete().catch(console.error)
        });
    }).catch(console.error);
}
