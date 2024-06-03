const axios = require("axios");
const { v4: uuidv4 } = require('uuid');

const dotenv = require('dotenv');
dotenv.config();

const { TOKEN_MERCADOPAGO } = process.env;

// Verifique se req está definido e tem as propriedades necessárias

const requestData = {
    transaction_amount: 100.50, //req.transaction_amount,
    description: "Compra de um produto",//req.description,
    payment_method_id: req.paymentMethodId,
    payer: {
        email: "williamuteich14@gmail.com",//req.email,
        identification: {
            type: "CPF", //req.identificationType,
            number: "86984292034"//req.number
        }
    }
};

const configApi = {
    headers: {
        'Authorization': `Bearer ${TOKEN_MERCADOPAGO}`,
        'Content-Type': 'application/json',
        'x-idempotency-key': uuidv4()
    }
};

axios.post('https://api.mercadopago.com/v1/payments', requestData, configApi)
    .then(response => {
        console.log("resultado da api mercadoPago:", response.data);
    })
    .catch(error => {
        console.error(error);
    });
