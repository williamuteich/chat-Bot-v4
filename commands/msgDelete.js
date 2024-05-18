const batchSize = 50; // Número máximo de mensagens por lote
const intervalBetweenBatches = 3000; // Intervalo em milissegundos entre lotes

export async function handleMsgDelete(message) {
    const canalAtual = message.channel;
    const canalId = canalAtual.id;

    // Verificar se o ID do canal está na lista de IDs que devem ser ignorados
    if (canalId === '1241267150727938048' || canalId === '1241324400658223164') {
        message.channel.send(`Comando não permitido neste canal: ${canalAtual.name}`);
        return;
    }

    try {
        const messagesToDelete = await fetchAllMessages(canalAtual);
        if (messagesToDelete.length > 0) {
            await deleteMessagesInBatches(messagesToDelete);
        }

        message.channel.send('Todas as mensagens foram deletadas com sucesso.');
    } catch (error) {
        message.channel.send('Ocorreu um erro ao tentar deletar as mensagens.');
    }
}

async function fetchAllMessages(channel) {
    const allMessages = [];
    let lastId = null;
    let fetching = true;

    while (fetching) {
        const messages = await channel.messages.fetch({ limit: batchSize, before: lastId });
        if (messages.size === 0) {
            fetching = false;
            break;
        }
        lastId = messages.last().id;
        allMessages.push(...messages.values());
    }

    return allMessages;
}

async function deleteMessagesInBatches(messages) {
    const totalBatches = Math.ceil(messages.length / batchSize);

    for (let i = 0; i < totalBatches; i++) {
        const batch = messages.slice(i * batchSize, (i + 1) * batchSize);

        try {
            await batchDelete(batch);
        } catch (error) {
            console.error(`Erro ao deletar lote ${i + 1}:`, error);
        }

        if (i < totalBatches - 1) {
            await wait(intervalBetweenBatches);
        }
    }
}

async function batchDelete(messages) {
    const oldMessages = messages.filter(msg => Date.now() - msg.createdAt.getTime() > 14 * 24 * 60 * 60 * 1000);
    const newMessages = messages.filter(msg => !oldMessages.includes(msg));

    console.log(`Deletando ${newMessages.length} mensagens mais recentes em lote.`);
    if (newMessages.length > 0) {
        await messages[0].channel.bulkDelete(newMessages);
    }

    console.log(`Deletando ${oldMessages.length} mensagens mais antigas individualmente.`);
    if (oldMessages.length > 0) {
        await deleteMessagesIndividually(oldMessages);
    }
}

async function deleteMessagesIndividually(messages) {
    try {
        await Promise.all(messages.map(msg => msg.delete()));
    } catch (error) {
        console.error('Erro ao tentar deletar mensagens individualmente:', error);
        // Caso haja falha, pode tentar deletar novam
    }
}