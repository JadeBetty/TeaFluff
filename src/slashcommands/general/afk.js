const { SlashCommandBuilder, EmbedBuilder, Client, PermissionsBitField, PermissionFlagsBits } = require('discord.js');
const { afkUsers } = require("../../utils/Cache");
module.exports = {
    category: "General",
    data: new SlashCommandBuilder()
        .setName('afk')
        .setDescription('Sets a afk status')
        .addStringOption(option => 
            option.setName("reason")
            .setDescription("Reason for being afk")
            .setRequired(false)
            ),
    async run(client, interaction) {
        let reason = interaction.options.getString("reason") || "No reason provided."
        if(reason.length > 60) {
            interaction.reply("Cannot set a afk status for those much reason.")
        }
        afkUsers.set(interaction.user.id, {
            reason, 
            username: interaction.member.displayName,
            timestamp: Date.now()
        })
        try {
            await interaction.member.setNickname(
                `[AFK] ${
                    interaction.member.displayName.length > 32
                    ? interaction.member.displayName.slice(0, 32)
                    : interaction.member.displayName
                }`
            )
        } catch (ignored) {
            console.log(ignored)
        }
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Random")
                .setTitle("AFK!")
                .setDescription("I've set you to be AFK.")
                .addFields(
                    {name: "User", value: interaction.member.displayName},
                    {name: "Reason", value: reason}

                )
            ]
        })
    }
}
