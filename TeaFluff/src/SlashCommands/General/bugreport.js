const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require("../../../config.json");
module.exports = {
    category: "Bot Development",
    data: new SlashCommandBuilder()
        .setName('bug-report')
        .setDescription('Report command for bugs')
        .addStringOption(option => option
            .setName("bug")
            .setDescription("The bug you want to report")
            .setRequired(true)),
    async run(client, interaction) {
        const reason = interaction.options.getString("bug");
        const bugChannel = client.channels.cache.get(config.bugChannel);
        if (!bugChannel) return;
        const theButtons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Accept")
                    .setCustomId("a-bugreport")
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setLabel("Deny")
                    .setCustomId("d-bugreport")
                    .setStyle(ButtonStyle.Danger)
            )
        bugChannel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("New bug reported")
                    .setColor("#f09999")
                    .addFields(
                        { name: `Bug`, value: reason },
                        { name: `By`, value: `<@!${interaction.user.id}>` },
                        { name: `Guild`, value: interaction.guild.name },
                        { name: `At`, value: `<t:${Math.floor(new Date() / 1000)}:F>` },
                        { name: `Status`, value: `Not fixed` }
                    )
            ],
            components: [theButtons]
        });
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Bug report submitted")
                    .setDescription("Your bug report has been submitted! Please wait for our developer to check it out!")
                    .setColor("#a8f1b0")
            ],
            ephemeral: true
        })
    }
}