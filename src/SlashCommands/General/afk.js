const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
module.exports = {
    category: "General",
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Sets an AFK Status')
        .addStringOption(option => option
            .setName("reason")
            .setDescription("Reason for afk")
            .setRequired(true)),
    async run(client, interaction) {
        const afkUsers = require("../../Commands/General/afk.js").afk;
        if (afkUsers.has(interaction.user.id)) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("You are already afk!"),
                ],
                ephemeral: true,
            });
        }
        let reason = interaction.options.getString("reason")
        if (reason.length > 60) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()

                        .setColor("#f09999")
                        .setDescription(
                            "Your reason is too long! You can only provide 60 characters!",
                        ),
                ],
                ephemeral: true
            });
        }

        afkUsers.set(interaction.user.id, {
            reason,
            username: interaction.member.displayName,
            timestamp: Date.now()
        })
        await interaction.deferReply({ephemeral: true});
        try {
            await interaction.member.setNickname(
                `[AFK] ${interaction.member.displayName.length > 32
                    ? interaction.member.displayName.slice(0, 32)
                    : interaction.member.displayName
                }`
            )
        } catch (ignored) {
            interaction.editReply({
                embeds: [
                    new EmbedBuilder()
                    .setColor("#f09999")
                    .setTitle("Invalid Permissions")
                    .setDescription("I do not have the permissions to edit your nickname!")
                ],
                ephemeral: true
            })
        }
        await wait(2000)
        return interaction.editReply({
            embeds: [
                new EmbedBuilder()
                    .setColor("#a8f1b0")
                    .setTitle("Afk Status")
                    .setDescription("I've set you to be afk!")
                    .addFields(
                        { name: "User", value: interaction.member.displayName },
                        { name: "Reason", value: reason }

                    )
            ]
        })
    }
}