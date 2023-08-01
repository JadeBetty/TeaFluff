const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonStyle,
    ButtonBuilder
} = require('discord.js');
const GuildSchema = require('../Schema/Guild').GuildData;
module.exports = {
    event: 'interactionCreate',
    async run(interaction, client) {
        if (interaction.isButton()) {
            if (interaction.customId === "a-bugreport") {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Bug fixed")
                            .setDescription("This bug has been fixed!")
                            .setColor("#a8f1b0")
                    ],
                    ephemeral: true
                })
                await interaction.message.edit({
                    embeds: [
                        EmbedBuilder.from(interaction.message.embeds[0].data).spliceFields(4, 1).addFields({ name: "Status", value: "Fixed" }).setColor("#a8f1b0"),
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel("Accept")
                                    .setStyle(ButtonStyle.Success)
                                    .setCustomId("a-bugreport")
                                    .setDisabled(true),
                                new ButtonBuilder()
                                    .setLabel("Deny")
                                    .setStyle(ButtonStyle.Danger)
                                    .setCustomId("d-bugreport")
                                    .setDisabled(true)
                            )
                    ]
                })
            } else if (interaction.customId === "d-bugreport") {
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Bug denied")
                            .setDescription("This bug has been denied!")
                            .setColor("#f09999")
                    ],
                    ephemeral: true
                })
                await interaction.message.edit({
                    embeds: [
                        EmbedBuilder.from(interaction.message.embeds[0].data).spliceFields(4, 1).addFields({ name: "Status", value: "Denied" }).setColor("#f09999"),
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel("Accept")
                                    .setStyle(ButtonStyle.Success)
                                    .setCustomId("a-bugreport")
                                    .setDisabled(true),
                                new ButtonBuilder()
                                    .setLabel("Deny")
                                    .setStyle(ButtonStyle.Danger)
                                    .setCustomId("d-bugreport")
                                    .setDisabled(true)
                            )
                    ]
                })
            }
        }
    }
}