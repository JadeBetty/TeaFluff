const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionFlagsBits } = require('discord.js')
const GuildSchema = require("../../Schema/Guild").GuildData;
module.exports = {
    category: "Moderation",
    data: new SlashCommandBuilder()
        .setName('warnings')
        .setDescription('Show a user warnings')
        .addUserOption(option => option
            .setName("member")
            .setDescription("Member to show warnings.")
            .setRequired(true)),
    async run(client, interaction) {
        const member = interaction.options.getMember("member");
        const guild = await GuildSchema.findOne({ guild: interaction.guild.id });
        let userWarnings = [];
        guild.cases.forEach((element, index) => {
            if (element.userId === member.user.id && element.case && typeof element.case === "string" && element.case.endsWith("warnAdd")) {
                userWarnings.push(element)
            }
        })

        if (userWarnings.length > 0) {
            const warningsEmbed = new EmbedBuilder()
                .setAuthor({ name: `${member.user.tag} has ${userWarnings.length} warnings!`, iconURL: member.user.displayAvatarURL() })
                .setTimestamp()
                .setColor("#f09999")

            for (let i = 0; i < userWarnings.length; i++) {
                warningsEmbed.addFields({ name: `Warning ${i + 1}`, value: `> **Case:** ${userWarnings[i].case.replace("warnAdd", "")} \n > **Moderator:** ${client.users.cache.get(userWarnings[i].mod)} \n > **Warned At:** <t:${userWarnings[i].timestamp}:F>` })
            }
            interaction.reply({
                embeds: [
                    warningsEmbed
                ]
            })
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: `${member.user.tag} has ${userWarnings.length} warnings!`, iconURL: member.user.displayAvatarURL() })
                        .setTimestamp()
                        .setDescription(`${member.user.tag} has ${userWarnings.length} warnings!`)
                        .setColor("#f09999")
                ]
            })
        }
    }
}