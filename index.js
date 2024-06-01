const { Client, Events, GatewayIntentBits, Collection } = require('discord.js')
const fs = require("node:fs")
const path = require("node:path")

const dotenv = require('dotenv')
dotenv.config()
const { TOKEN_BOT } = process.env

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

client.on(Events.InteractionCreate, interaction => {

    if (!interaction.isModalSubmit()) return;
    if (interaction.isModalSubmit()) {
        const componente = interaction.components;
        const values = {};

        componente.forEach(pegaValue => {
           pegaValue.components.forEach(pega => {
               values[pega.customId] = pega.value;
           });
        });
       
        interaction.reply(`seus dados são: \n ${values.nomeInput}\n ${values.sobrenomeInput}\n ${values.emailInput}\n ${values.cpfInput}\n ${values.hobbiesInput}`);
        //preciso fazer a integração com a API do MercadoPago via pix. 
        //Pegar Qr Code e url gerada para pagamento.
        //exibir o valor a ser pago e o nome do produto.
        //Exibir os dados do usuário para confirmação.
        //aguardar a confirmação de pagamentpo.
    }
});



client.login(TOKEN_BOT)