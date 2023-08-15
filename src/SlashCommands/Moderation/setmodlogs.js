const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js')
const GuildSchema = require("../../Schema/Guild").GuildData;
module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('setmodlog')
        .setDescription('Set moderation logs for the server.')
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("Channel you want to set moderation logs to.")
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildText)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async run(client, interaction) {
        const channel = interaction.options.getChannel("channel");
        await GuildSchema.findOneAndUpdate({ guild: interaction.guild.id }, { channel: channel.id });
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setDescription(`Successfully changed server moderation channel logs to ${channel}!`)
                .setColor("#a8f1b0")
            ],
            ephemeral: true
        })
    }
}