export async function handleMsgDelete(message) {
    const canalAtual = message.channel;
    const canalId = canalAtual.id;

    // Verificar se o ID do canal está na lista de IDs que devem ser ignorados
    if (canalId === '1241267150727938048' || canalId === '1241324400658223164') {
        message.channel.send(`Comando não permitido neste canal: ${canalAtual.name}`);
        return;
    }

    try {
        const canalMensagens = await canalAtual.messages.fetch();

        canalMensagens.forEach(async item => {
            await item.delete();
        });
    } catch (error) {
        message.channel.send('Erro ao tentar deletar as mensagens:', error);
    }
}