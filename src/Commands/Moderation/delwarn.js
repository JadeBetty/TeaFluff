const GuildSchema = require("../../Schema/Guild").GuildData;
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "delwarn",
    description: "Warn a member",
    category: "Moderation",
    permissions: ["KickMembers"],
    deleteTrigger: true,
    run: async (client, message, args) => {
        const guild = await GuildSchema.findOne({ guild: message.guild.id });
        const caseNumber = args[0]
        if (!caseNumber) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid Usage!")
                    .setColor("#f09999")
                    .setDescription(`Usage: ${guild.prefix}delwarn <warningCase> <reason>!`)
            ]
        })

        if (isNaN(caseNumber)) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid warning case!")
                    .setColor("#f09999")
                    .setDescription(`The warning case you provided is invalid!`)
            ]
        })
        args.shift();
        const newReason = args.join(" ") || "No reason provided";
        const index = guild.cases.findIndex((c) => {
            return typeof c.case === "string" && c.case.split(" ")[0] === caseNumber;
        })
        if(!index) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setTitle("Invalid warning case!")
                .setDescription(`The warning case you provided is invalid!`)
                .setColor("#f09999")
            ]
        })
        const theWarningObject = guild.cases[index];
        guild.cases.splice(index, 1);
        await GuildSchema.updateOne({ guild: message.guild.id }, {cases: guild.cases})
        const user = client.users.cache.get(theWarningObject.userId);
        const oldMod = client.users.cache.get(theWarningObject.mod)
        const oldReason = theWarningObject.reason;
        message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${user.tag} warning has been deleted!`)
                    .setColor("a8f1b0")
            ]
        })
        user.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                    .setDescription(`Your warning from ${message.guild.name} has been deleted!`)
                    .addFields(
                        { name: `Case`, value: theWarningObject.case },
                        { name: `Moderator`, value: message.author.tag },
                        { name: `Reason`, value: newReason },
                        { name: `Old reason`, value: oldReason }
                    )
                    .setTimestamp()
                    .setColor("#f09999")
            ]
        }).catch(err => {
            client.errorLogger.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("New DiscordAPI encounted")
                        .setDescription(`\`\`\`${err}\`\`\``)
                        .setColor("#f09999")
                ]
            })
        })

        const channelLog = client.channels.cache.get(guild.channel);
        if (!channelLog) return;
        channelLog.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                    .setColor("#f09999")
                    .setTimestamp()
                    .addFields(
                        { name: `User`, value: `<@!${user.id}> | ${user.id} ` },
                        { name: `Moderator`, value: `<@!${message.author.id}> | ${message.author.id}` },
                        { name: `Old Moderator`, value: `<@!${oldMod.id}> | ${oldMod.id}` },
                        { name: `Case`, value: `${theWarningObject.case.split(" ")[0]} | Warning Delete` },
                        { name: `Old Reason`, value: `${oldReason}` },
                        { name: `New Reason`, value: `${newReason}` }
                    )
            ]
        })
    }
}