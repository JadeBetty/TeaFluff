const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");
const imports = require("../imports/embed");
const config = require("../../config.json");
const BLG = require("../Schema/Blacklist");
module.exports = {
    event: "interactionCreate",
    async run(interaction, client) {
        if (interaction.isModalSubmit()) {
            if (interaction.customId.startsWith("modal-appeal-server")) {
                await interaction.reply({
                    embeds: [
                        imports.MSS
                    ],
                    ephemeral: true
                })
                const buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Accept")
                            .setCustomId("a-appeal-s")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setLabel("Deny")
                            .setCustomId("d-appeal-s")
                            .setStyle(ButtonStyle.Danger)
                    )
                const owner = interaction.user;
                const why = interaction.fields.getTextInputValue("text-why");
                const promise = interaction.fields.getTextInputValue("text-promise");
                client.channels.cache.get(config.bugChannel).send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("New BlackList Appeal has been submitted!")
                            .addFields(
                                { name: "Owner", value: `${interaction.user} || ${interaction.user.id}` },
                                { name: "Why should your server be whitelisted?", value: `\`\`\`${why}\`\`\`` },
                                { name: "How would you avoid server blacklist?", value: `\`\`\`${promise}\`\`\`` } 
                            )
                            .setColor("#f09999")
                    ],
                    components: [buttons]
                })
            } else if(interaction.customId.startsWith("modal-appeal-user")) {
                await interaction.reply({
                    embeds: [
                        imports.MSS
                    ],
                    ephemeral: true
                })
                const buttons = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Accept")
                            .setCustomId("a-appeal-u")
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setLabel("Deny")
                            .setCustomId("d-appeal-u")
                            .setStyle(ButtonStyle.Danger)
                    )
                const why = interaction.fields.getTextInputValue("text-why");
                const promise = interaction.fields.getTextInputValue("text-promise");
                client.channels.cache.get(config.bugChannel).send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("New BlackList Appeal has been submitted!")
                            .addFields(
                                { name: "Owner", value: `${interaction.user} || ${interaction.user.id}` },
                                { name: "Why should you be whitelisted?", value: `\`\`\`${why}\`\`\`` },
                                { name: "How would you avoid blacklist?", value: `\`\`\`${promise}\`\`\`` } 
                            )
                            .setColor("#f09999")
                    ],
                    components: [buttons]
                })
            }
        }
        if (interaction.isButton()) {
            if (interaction.customId === "a-appeal-s") {
                const server = require("../SlashCommands/Moderation/appeal-server").server;
                await interaction.update({
                    embeds: [
                        EmbedBuilder.from(interaction.message.embeds[0].data).setColor("#a8f1b0")
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel("Accept")
                                    .setStyle(ButtonStyle.Success)
                                    .setCustomId("a-appeal-s")
                                    .setDisabled(true),
                                new ButtonBuilder()
                                    .setLabel("Deny")
                                    .setStyle(ButtonStyle.Danger)
                                    .setCustomId("d-appeal-s")
                                    .setDisabled(true)
                            )
                    ]
                })
                await interaction.user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Your appeal has been accepted!")
                            .addFields(
                                { name: "Moderator", value: `${interaction.user.tag}` },
                            )
                            .setDescription("Congratulations on your server being whitelisted in just 24 hours! We are thrilled to have you as a part of our community and hope you have a wonderful experience with us. Don't hesitate to reach out if you have any questions or concerns. Thank you for choosing us!")
                            .setColor("#a8f1b0")
                            .setTimestamp()
                    ]
                })

                setInterval(async () => {
                    await BLG.findOneAndDelete({ guildId: server.id })
                }, 8.64e+7)
            } else if (interaction.customId === "d-appeal-s" ) {
                await interaction.update({
                    embeds: [
                        EmbedBuilder.from(interaction.message.embeds[0].data).setColor("#a8f1b0")
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel("Accept")
                                    .setStyle(ButtonStyle.Success)
                                    .setCustomId("a-appeal-s")
                                    .setDisabled(true),
                                new ButtonBuilder()
                                    .setLabel("Deny")
                                    .setStyle(ButtonStyle.Danger)
                                    .setCustomId("d-appeal-s")
                                    .setDisabled(true)
                            )
                    ]
                })
                await interaction.user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Your appeal has been denied!")
                            .setDescription("We apologize for the server whitelist issue. Please be assured that our team is working hard to resolve the problem. We appreciate your interest in our community. Thank you for your patience and understanding.")
                            .addFields(
                                { name: "Moderator", value: `${interaction.user.tag}` },
                            )
                            .setColor("#f09999")
                            .setTimestamp()
                    ]
                })
            } else  if (interaction.customId === "a-appeal-u") {
                const server = require("../SlashCommands/Moderation/appeal-user").user;
                await interaction.update({
                    embeds: [
                        EmbedBuilder.from(interaction.message.embeds[0].data).setColor("#a8f1b0")
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel("Accept")
                                    .setStyle(ButtonStyle.Success)
                                    .setCustomId("a-appeal-u")
                                    .setDisabled(true),
                                new ButtonBuilder()
                                    .setLabel("Deny")
                                    .setStyle(ButtonStyle.Danger)
                                    .setCustomId("d-appeal-u")
                                    .setDisabled(true)
                            )
                    ]
                })
                await interaction.user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Your appeal has been accepted!")
                            .addFields(
                                { name: "Moderator", value: `${interaction.user.tag}` },
                            )
                            .setDescription("Congratulations of being whitelisted in just 24 hours! We are thrilled to have you as a part of our community and hope you have a wonderful experience with us. Don't hesitate to reach out if you have any questions or concerns. Thank you for choosing us!")
                            .setColor("#a8f1b0")
                            .setTimestamp()
                    ]
                })

                setInterval(async () => {
                    await BLG.findOneAndDelete({ guildId: server.id })
                }, 8.64e+7)
            } else if (interaction.customId === "d-appeal-s" ) {
                await interaction.update({
                    embeds: [
                        EmbedBuilder.from(interaction.message.embeds[0].data).setColor("#a8f1b0")
                    ],
                    components: [
                        new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setLabel("Accept")
                                    .setStyle(ButtonStyle.Success)
                                    .setCustomId("a-appeal-u")
                                    .setDisabled(true),
                                new ButtonBuilder()
                                    .setLabel("Deny")
                                    .setStyle(ButtonStyle.Danger)
                                    .setCustomId("d-appeal-u")
                                    .setDisabled(true)
                            )
                    ]
                })
                await interaction.user.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Your appeal has been denied!")
                            .setDescription("We apologize for you being blacklisted. We appreciate your interest in our community. Thank you for your patience and understanding.")
                            .addFields(
                                { name: "Moderator", value: `${interaction.user.tag}` },
                            )
                            .setColor("#f09999")
                            .setTimestamp()
                    ]
                })
        }
    }
    }
}