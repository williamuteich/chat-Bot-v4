const { Payment, MercadoPagoConfig } = require('mercadopago');
const dbConnection = require('../database/discordDatabase').client;
const dotenv = require('dotenv');

dotenv.config();
const { TOKEN_MERCADOPAGO } = process.env;

const clientMercadoPago = new MercadoPagoConfig({ accessToken: TOKEN_MERCADOPAGO, options: { timeout: 5000 } });
const payment = new Payment(clientMercadoPago);

async function pollPayments() {
    const db = dbConnection.db();
    const paymentsCollection = db.collection('gatewayPayments');

    try {
        const pendingPayments = await paymentsCollection.find({ status: 'pending' }).toArray();

        for (const paymentRecord of pendingPayments) {
            const { paymentId, userDiscordId } = paymentRecord;
            const response = await payment.get({ id: paymentId });

            if (response && response.body) {
                const status = response.body.status;

                if (status !== 'pending') {
                    await paymentsCollection.updateOne(
                        { paymentId },
                        { $set: { status } }
                    );

                    if (status === 'approved') {
                        const embed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle('Pagamento Aprovado!')
                            .setDescription('Seu pagamento foi aprovado e você já pode utilizar os comandos /gemini e /prodia.')
                            .setTimestamp();

                        const user = await client.users.fetch(userDiscordId);
                        if (user) {
                            await user.send({ embeds: [embed] });
                        }

                        // Adicione aqui a lógica para liberar o serviço/produto pago
                        console.log(`Pagamento aprovado: ${paymentId}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Erro ao verificar pagamentos pendentes:', error);
    }
}

// Chame esta função a cada intervalo de tempo definido, por exemplo, a cada 5 minutos
setInterval(pollPayments, 5 * 60 * 1000);
