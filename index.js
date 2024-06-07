const { Client, Events, GatewayIntentBits, Collection, EmbedBuilder  } = require('discord.js');
//const { buildModal } = require('./modalBuilder.js');
const isUserRegistered = require('./Querys/consultaUsers');

const fs = require("node:fs")
const path = require("node:path")

const dotenv = require('dotenv')
dotenv.config()
const { TOKEN_BOT, TOKEN_MERCADOPAGO, TOKEN_CHAVEPIX } = process.env

const { Payment, MercadoPagoConfig } = require ('mercadopago');

const clientMercadoPago = new MercadoPagoConfig({ accessToken: TOKEN_MERCADOPAGO, options: { timeout: 5000, idempotencyKey: 'abc' } });
const payment = new Payment(clientMercadoPago);

const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.commands = new Collection()

for (const file of commandFiles){
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command)
    } else  {
        console.log(`Esse comando em ${filePath} está com "data" ou "execute ausentes"`)
    } 
}

client.once(Events.ClientReady, c => {
	console.log(`O bot está online como ${c.user.tag}`)
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        const userDiscord = interaction.user.id;
        const isRegistered = await isUserRegistered(userDiscord);

        if (!isRegistered && interaction.commandName !== 'register') {
            const exampleEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Registre-se!')
                .setDescription('Cadastre-se para poder utilizar os comandos do bot Scripto!')
                .setThumbnail('https://cdnb.artstation.com/p/assets/images/images/045/972/517/large/flynn-coltman-bantha-nft.jpg?1643982096')
                .addFields({ name: 'Para se registrar, Digite o comando:', value: '/register', inline: true })
                .setTimestamp();

            await interaction.reply({ embeds: [exampleEmbed], ephemeral: true });
            return;
        }

        const command = client.commands.get(interaction.commandName);

        if (command) {
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Houve um erro ao executar esse comando!', ephemeral: true });
            }
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === 'ModalRegister') {

            const valueModal = interaction.fields.fields.map(field => [field.customId, field.value, ]);
            const data = Object.fromEntries(valueModal);

            console.log("pegou as porra aqui", data + interaction.member.user.id)
            // Aqui processar os dados e registrar o usuário no banco de dados
            // Depois de registrar, responder ao usuário que os dados foram registrados com sucesso
            await interaction.reply({ content: 'Dados Registrados com Sucesso!', ephemeral: true });
        }
    }
});

//client.on(Events.InteractionCreate, async interaction => {
//    if (!interaction.isModalSubmit()) return;
//    const componente = interaction.components;
//    const values = {};
//
//    componente.forEach(pegaValue => {
//        pegaValue.components.forEach(pega => {
//            values[pega.customId] = pega.value;
//        });
//    });
//
//    await interaction.reply(`Os dados foram enviados`);
//
//    try {
//
//        //qr_code: É o copia e cola
//        //qr_code_base64: É o QR code imagem.
//        //ticket_url: direciona para o mercado pago para efetuar o pagamento.
//        const paymentData = {
//            transaction_amount: 0.01,
//            description: 'Payment for product',
//            payment_method_id: 'pix',
//            token: TOKEN_CHAVEPIX,
//            payer: {
//                email: 'willianuteich@hotmail.com',
//                first_name: 'william',
//                last_name: 'Uteich',
//                identification: {
//                    type: 'CPF',
//                    number: '86984292034'
//                }
//            }
//        };
//        
//        //console.log("Dados do pagamento:", paymentData);
//        
//        payment.create({
//            body: paymentData,
//            requestOptions: { idempotencyKey: '7777asd7788qw7eqwe' } //aqui eu preciso passar um ID quando for criar um pagamento, para depois conseguir consultar pela API o status do pagamento.
//        })
//        .then((result) => console.log(result))
//        .catch((error) => console.log(error));
//        
//    
//    } catch (error) {
//        console.log(error)
//    }
//
//    //payment.get({
//    //    "id": '79694095418',
//    //}).then(response => {
//    //    console.log("Resultado da consulta de pagamento:", response);
//    //}).catch(error => {
//    //    console.log("Erro ao obter o pagamento:", error);
//    //});
//
//});
//

client.login(TOKEN_BOT)
