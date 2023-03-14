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
        let c = await GuildSchema.findOne({ guild: interaction.guild.id });
        if(!c) {
            c = await GuildSchema.create({ guild: interaction.guild.id, channel: channel.id })
        } else {
            await GuildSchema.findOneAndUpdate({
                guild: interaction.guild.id
            }, {
                channel: channel.id
            })
        }
        interaction.reply({
            content: `This server moderation log has been set to ${channel}`, ephemeral: true
        })
    }
}