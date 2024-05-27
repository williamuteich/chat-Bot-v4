import { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } from 'discord.js';

export async function handleNewAccount(message) {
    // Cria o objeto Embed
    const exampleEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Dê vida às suas ideias com a nossa IA!')
        .setURL('https://cdnb.artstation.com/p/assets/images/images/045/972/517/large/flynn-coltman-bantha-nft.jpg?1643982096')
        .setAuthor({ name: 'Some name', iconURL: 'https://cdnb.artstation.com/p/assets/images/images/045/972/517/large/flynn-coltman-bantha-nft.jpg?1643982096', url: 'https://discord.js.org' })
        .setDescription('Descubra um mundo de possibilidades com a nossa plataforma de inteligência artificial. Nossa tecnologia de ponta permite que você crie imagens impressionantes, gere texto criativo e explore o potencial da IA.')
        .setThumbnail('https://cdnb.artstation.com/p/assets/images/images/045/972/517/large/flynn-coltman-bantha-nft.jpg?1643982096')
        .setImage('https://cdn.pixabay.com/photo/2023/11/28/06/25/ai-generated-8416791_1280.png')
        .setTimestamp()
        .setFooter({ 
            text: '🛒 Formas de pagamento: Pix\n💳 Pagamentos destacados: Mercado Pago', 
            iconURL: 'https://i.pinimg.com/originals/a8/d1/e2/a8d1e2ded2b3264ec618c059af0c0b70.png'
        });

    // Envia o embed
    const msg = await message.channel.send({ embeds: [exampleEmbed] });

    // Cria o botão "Confirmar"
    const confirmButton = new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Confirmar')
        .setStyle(ButtonStyle.Danger);

    // Cria o botão "Cancelar"
    const cancelButton = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancelar')
        .setStyle(ButtonStyle.Secondary);

    // Cria a linha de ação com os botões
    const actionRow = new ActionRowBuilder()
        .addComponents(confirmButton, cancelButton);

    // Envia a mensagem com os botões
    await message.channel.send({
        content: 'Escolha uma opção:',
        components: [actionRow.toJSON()] // Convertendo a ActionRow para o formato JSON
    });
}
