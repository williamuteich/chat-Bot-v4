const { Client, Events, GatewayIntentBits, Collection } = require('discord.js')
const fs = require("node:fs")
const path = require("node:path")

const dotenv = require('dotenv')
dotenv.config()
const { TOKEN_BOT, TOKEN_MERCADOPAGO } = process.env

const { Payment, MercadoPagoConfig } = require ('mercadopago');

const clientMercadoPago = new MercadoPagoConfig({ accessToken: TOKEN_MERCADOPAGO });
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

client.on(Events.InteractionCreate, async interaction =>{
    if (!interaction.isChatInputCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)
    if (!command) {
        console.error("Comando não encontrado")
        return
    }
    try {
        await command.execute(interaction)
    } 
    catch (error) {
        console.error(error)
        await interaction.reply("Houve um erro ao executar esse comando!")
    }
})

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;
    const componente = interaction.components;
    const values = {};

    componente.forEach(pegaValue => {
        pegaValue.components.forEach(pega => {
            values[pega.customId] = pega.value;
        });
    });

    // Salvar os dados no banco, se houver um CPF válido, email válido e os dados não forem existentes, gravará no banco.
    await interaction.reply(`Os dados foram enviados`);

    // Fazer a integração com a API do MercadoPago via PIX.
    // Pegar Qr Code e URL gerada para pagamento.
    // Exibir o valor a ser pago e o nome do produto.
    // Exibir os dados do usuário para confirmação.
    // Aguardar a confirmação de pagamento.

    try {
        payment.create({
            body: { 
                transaction_amount: 58,
                description: "descrição qualquer",
                payment_method_id: "pix",
                    payer: {
                    email: "williamuteich@gmail.com",
                    identification: {
                type: "CPF",
                number: "86984292034"
            }}},
            requestOptions: { idempotencyKey: '1123333467788122356765' }
        })
        .then((result) => console.log(result))
        .catch((error) => console.log(error));   
    
} catch (error) {
    console.log(error)
}});


client.login(TOKEN_BOT)