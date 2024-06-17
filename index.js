const { Client, Events, GatewayIntentBits, Collection, EmbedBuilder  } = require('discord.js');
const isUserRegistered = require('./Querys/consultaUsers');
const salvarRegistros = require('./Querys/saveUsers');
const { getUserCredits, updateUserCredits } = require('./credits');
const { Payment, MercadoPagoConfig } = require('mercadopago');

const fs = require("node:fs")
const path = require("node:path")

const dotenv = require('dotenv')
dotenv.config()
const { TOKEN_BOT, TOKEN_MERCADOPAGO} = process.env

const clientMercadoPago = new MercadoPagoConfig({ accessToken: TOKEN_MERCADOPAGO, options: { timeout: 5000 } });
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
        const userServerDiscordID = interaction.guild.id;
        const serverName = interaction.guild.name;
        const isRegistered = await isUserRegistered(userDiscord, userServerDiscordID, serverName);

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

        if (isRegistered && interaction.commandName === 'register') {
            await interaction.reply("Você já está cadastrado.");
            return;
        }

        const command = client.commands.get(interaction.commandName);

        if (command) {
            try {
                if (interaction.commandName === 'gemini' || interaction.commandName === 'prodia') {
                    const userCredits = await getUserCredits(userDiscord, userServerDiscordID);
                    
                    if (userCredits > 0) {
                        await command.execute(interaction);
                        const updateResult = await updateUserCredits(userDiscord, userServerDiscordID, userCredits - 1);
                       if (updateResult) {
                           await interaction.followUp(`Você tem ${userCredits - 1} créditos restantes.`);
                       } else {
                           await interaction.followUp('Erro ao atualizar seus créditos. Por favor, tente novamente.');
                       }
                    } else {
                        await interaction.reply({ content: 'Você não tem créditos suficientes para executar este comando.', ephemeral: true });
                    }
                } else {
                    await command.execute(interaction);
                }
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'Houve um erro ao executar esse comando!', ephemeral: true });
            }
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === 'ModalRegister') {

            const userDiscord = interaction.member.user.id;
            const isRegistered = await isUserRegistered(userDiscord);

            if (isRegistered) {
                await interaction.reply("Usuário já registrado em nosso Banco de Dados.");
                return;
            }

            const valueModal = interaction.fields.fields.map(field => [field.customId, field.value]);
            const data = Object.fromEntries(valueModal);
    
            data.userDiscord = userDiscord;
            data.serverIdDiscord = interaction.guild.id; 
            data.serverNameDiscord = interaction.guild.name; 
    
            const { nomeInput, sobrenomeInput, emailInput, cpfInput, phoneInput } = data;
            if (!nomeInput || !sobrenomeInput || !emailInput || !cpfInput || !phoneInput) {
                await interaction.reply({ content: 'Todos os campos são obrigatórios.', ephemeral: true });
                return;
            }
    
            const result = await salvarRegistros({
                userDiscord: data.userDiscord,
                serverIdDiscord: data.serverIdDiscord,
                serverNameDiscord: data.serverNameDiscord,
                email: emailInput,
                name: nomeInput,
                last_name: sobrenomeInput,
                cpf: cpfInput,
                phone: phoneInput
            });
    
            if (result.success) {
                await interaction.reply({ content: 'Dados Registrados com Sucesso!', ephemeral: true });
            } else if (result.message === "Usuário já registrado.") {
                await interaction.reply({ content: 'Usuário já registrado.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'Erro ao registrar os dados.', ephemeral: true });
            }
        }
    }
});

//client.on(Events.InteractionCreate, async interaction => {


    //fazer requisição do status do pagamento aqui.
    //payment.get({
    //    "id": '80741382976',
    //}).then(response => {
    //    console.log("Resultado da consulta de pagamento:", response);
    //}).catch(error => {
    //    console.log("Erro ao obter o pagamento:", error);
    //});

//});


client.login(TOKEN_BOT)
