const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js')
const GuildSchema = require("../../Schema/Guild").GuildData;
module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('prefix')
        .setDescription('Set the server prefix!')
        .addSubcommand(command => command
            .setName("set")
            .setDescription("Set the server prefix!")
            .addStringOption(option => option
                .setName("prefix")
                .setDescription("The prefix that you wanna change to.")
                .setRequired(true)
            ))
        .addSubcommand(command => command
            .setName("reset")
            .setDescription("Reset the server prefix!")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async run(client, interaction) {
        let guild = await GuildSchema.findOne({ guild: interaction.guild.id });
        if (!guild) {
            guild = await GuildSchema.create({
                id: interaction.guild.id
            })
        }
        const command = interaction.options.getSubcommand();

        if (command === "set") {
            const prefix = interaction.options.getString("prefix");
            if (prefix.includes(" ")) return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Invalid Usage!")
                        .setDescription(`The prefix you provided contains a space!`)
                        .setColor("#f09999")
                ],
                ephemeral: true
            })

            await GuildSchema.findOneAndUpdate({
                guild: interaction.guild.id
            }, {
                prefix: prefix
            });
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Successfully changed server prefix to \`${prefix}\``)
                        .setColor("#a8f1b0")
                ],
                ephemeral: true
            })
        } else if (command === "reset") {
            await GuildSchema.findOneAndUpdate({ guild: interaction.guild.id }, { prefix: "." });
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`Successfully resetted server prefix to \`.\``)
                        .setColor("#a8f1b0")
                ],
                ephemeral: true
            })
        }
    }
}