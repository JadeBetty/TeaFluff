const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, AutoModerationRuleEventType } = require('discord.js');
const imports = require("../../imports/embed");
module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('appeal-user')
        .setDescription('Appeal your blacklisted user.'),
    async run(client, interaction) {
        const modal = new ModalBuilder()
            .setTitle("BlackList Appeal")
            .setCustomId(`modal-appeal-user`)
        const why = new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId("text-why")
                    .setLabel("Why should you be whitelisted?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setPlaceholder("I should be whitelisted because ...")
            )

        const promise = new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId("text-promise")
                    .setLabel("How would you avoid account blacklist?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setPlaceholder("I can ensure that I will never be blacklisted again because ...")
            )
        modal.addComponents(why, promise);
       await interaction.showModal(modal);
       module.exports.user = interaction.user
    },
}