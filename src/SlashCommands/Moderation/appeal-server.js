const { SlashCommandBuilder, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, AutoModerationRuleEventType } = require('discord.js');
const imports = require("../../imports/embed");
module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('appeal-server')
        .setDescription('Appeal your blacklisted server.')
        .addStringOption(option => option
            .setName("servername")
            .setDescription("Your blacklisted server name.")
            .setRequired(true)),
    async run(client, interaction) {
        const servername = await interaction.options.getString("servername");
        const server = await client.guilds.cache.find(n => n.name === servername);
        if (!server) return interaction.reply({
            embeds: [
                imports.INS
            ],
            ephemeral: true
        });
        const modal = new ModalBuilder()
            .setTitle("BlackList Appeal")
            .setCustomId(`modal-appeal-server`)
        const why = new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId("text-why")
                    .setLabel("Why should your server be whitelisted?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setPlaceholder("My server should be whitelisted because ...")
            )

        const promise = new ActionRowBuilder()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId("text-promise")
                    .setLabel("How would you avoid server blacklist?")
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setPlaceholder("I can ensure that my server will never be blacklisted again because ...")
            )
        modal.addComponents(why, promise);
       await interaction.showModal(modal);
       module.exports.server = server
    },
}