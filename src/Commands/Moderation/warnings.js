const GuildSchema = require("../../Schema/Guild").GuildData;
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "warnings",
    description: "Get a member warnings",
    category: "Moderation",
    permissions: ["KickMembers"],
    deleteTrigger: true,
    run: async (client, message, args) => {
        const guild = await GuildSchema.findOne({ guild: message.guild.id });
        const member = client.users.cache.get(args[0]) || message.mentions.members.first();
        if (!member) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid Usage!")
                    .setColor("#f09999")
                    .setDescription(`Usage: ${guild.prefix}warnings <@member>`)
            ]
        })
        let userWarnings = [];
        guild.cases.forEach((element, index) => {
            if (element.userId === member.user.id && element.case && typeof element.case === "string" && element.case.endsWith("warnAdd")) {
                userWarnings.push(element)
            }
        })
        if(userWarnings.length > 0) {
            const warningsEmbed = new EmbedBuilder()
            .setAuthor({name: `${member.user.tag} has ${userWarnings.length} warnings!`, iconURL: member.user.displayAvatarURL()})
            .setTimestamp()
            .setColor("#f09999")

            for(let i = 0; i < userWarnings.length; i++) {
                warningsEmbed.addFields({ name: `Warning ${i + 1}`, value: `> **Case:** ${userWarnings[i].case.replace("warnAdd", "")} \n > **Moderator:** ${client.users.cache.get(userWarnings[i].mod)} \n > **Warned At:** <t:${userWarnings[i].timestamp}:F>`})
            }
            message.channel.send({embeds: [
                warningsEmbed
            ]})
        } else {
            message.channel.send({
              embeds: [
                new EmbedBuilder()
                .setAuthor({name: `${member.user.tag} has ${userWarnings.length} warnings!`, iconURL: member.user.displayAvatarURL()})
                .setTimestamp()
                .setDescription(`${message.author.tag} has ${userWarnings.length} warnings!`)
                .setColor("#f09999")
              ] 
            })
        }
    }
}