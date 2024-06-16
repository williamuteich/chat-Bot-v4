const dbConnection = require('../database/discordDatabase').client;
const { SlashCommandBuilder } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();
const { TOKEN_MERCADOPAGO, TOKEN_CHAVEPIX } = process.env;

const { Payment, MercadoPagoConfig } = require('mercadopago');
const clientMercadoPago = new MercadoPagoConfig({ accessToken: TOKEN_MERCADOPAGO, options: { timeout: 5000 } });
const payment = new Payment(clientMercadoPago);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pix')
        .setDescription('Realiza um pagamento via Pix.'),
    
    async execute(interaction) {
        try {
            const userDiscordID = interaction.user.id; 
            const db = dbConnection.db();
            const usersCollection = db.collection('users');
            
            const user = await usersCollection.findOne({ discordUserID: userDiscordID });

            console.log("Resultado do usuário:", user);

            const paymentData = {
                transaction_amount: 0.01,
                description: 'Payment for product',
                payment_method_id: 'pix',
                token: TOKEN_CHAVEPIX,
                payer: {
                    email: user.email,
                    first_name: user.name,
                    last_name: user.last_name,
                    identification: {
                        type: 'CPF',
                        number: user.cpf,
                    }
                }
            };
            
            //console.log("Dados do pagamento:", paymentData);
            
            const result = await payment.create({
                body: paymentData,
                requestOptions: { idempotencyKey: '777888999223' }
            });

            //console.log("Resultado do pagamento:", result.point_of_interaction.transaction_data.qr_code);
            //console.log("Resultado do pagamento:", result.point_of_interaction.transaction_data.ticket_url);
            //await interaction.reply(`Resultado do pagamento COPIA E COLA: ${result.point_of_interaction.transaction_data.qr_code}\n URL para pagamento: ${result.point_of_interaction.transaction_data.ticket_url}`);
        } catch (error) {
            console.error("Erro ao executar o pagamento:", error);
            await interaction.reply("Erro ao executar o pagamento: " + error.message);
        }
    }
};
