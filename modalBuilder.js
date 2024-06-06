const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

function buildModal(userDiscord) {
    const modal = new ModalBuilder()
        .setCustomId('Registro')
        .setTitle('Preencha o formulário com os seus dados.');

        const nomeInput = new TextInputBuilder()
        .setCustomId('nomeInput')
        .setLabel("Qual o seu nome?")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setValue("william");

        const sobrenomeInput = new TextInputBuilder()
            .setCustomId('sobrenomeInput')
            .setLabel("Qual o seu sobrenome?")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue("william");
        
        const emailInput = new TextInputBuilder()
            .setCustomId('emailInput')
            .setLabel('Seu Email?')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue("william");

        const cpfInput = new TextInputBuilder()
            .setCustomId('cpfInput')
            .setLabel('CPF')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue("william");
        
        const hobbiesInput = new TextInputBuilder()
            .setCustomId('phoneInput')
            .setLabel('Telefone')
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            .setValue("51998682733");

        const primeiroNome = new ActionRowBuilder().addComponents(nomeInput);
        const sobrenome = new ActionRowBuilder().addComponents(sobrenomeInput);
        const emailUsuario = new ActionRowBuilder().addComponents(emailInput);
        const cpfUsuario = new ActionRowBuilder().addComponents(cpfInput);
        const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

        modal.addComponents(primeiroNome, sobrenome, emailUsuario, cpfUsuario, secondActionRow);
        
        let objValue = {};

        modal.components.forEach(actionRow => {
            actionRow.components.forEach(component => {
                if (component instanceof TextInputBuilder) {
                    objValue[component.data.custom_id] = component.data.value;
                }
            });
        });

        console.log("valor do objeto", objValue, "aqui vai ter o id do usuario do disc,",);

    return modal;
}

module.exports = { buildModal };
