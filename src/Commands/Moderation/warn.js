const GuildSchema = require("../../Schema/Guild").GuildData;
const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "warn",
    description: "Warn a member",
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
                    .setDescription(`Usage: ${guild.prefix}warn <@member> <reason>!`)
            ]
        })
        args.shift();
        const reason = args.join(" ") || "No reason provided.";
        await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${member.user.tag} has been warned!`)
                    .setColor("#a8f1b0")
            ]
        });

        let newCase = guild.case;
        newCase++
        await GuildSchema.updateOne({ guild: message.guild.id }, { case: newCase });

        member.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`You has been warned from ${message.guild.name}!`)
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                    .addFields(
                        { name: `User`, value: member.user.tag },
                        { name: `Moderator`, value: message.author.tag },
                        { name: `Case`, value: `${newCase}` },
                        { name: `Reason`, value: reason },
                    )
                    .setTimestamp()
                    .setColor("#f09999")
            ],
        }).catch(async e => {
            client.errorLogger.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("New DiscordAPI Error encounted")
                        .setDescription(`\`\`\`${e}\`\`\``)
                        .setColor("#f09999")
                ]
            })
        })


        guild.cases.push({
            userId: member.user.id,
            reason: reason,
            case: `${newCase} warnAdd`,
            mod: message.author.id,
            timestamp: Math.round(Date.now() / 1000)
        })
        await GuildSchema.updateOne({ guild: message.guild.id }, { cases: guild.cases })
        const channelLog = client.channels.cache.get(guild.channel);
        if (!channelLog) return;
        channelLog.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                    .setColor("#f09999")
                    .setTimestamp()
                    .addFields(
                        { name: `User`, value: `<@!${member.user.id}> | ${member.user.id} ` },
                        { name: `Moderator`, value: `<@!${message.author.id}> | ${message.author.id}` },
                        { name: `Case`, value: `${newCase} | Warn` },
                        { name: `Reason`, value: `${reason}` }
                    )
            ]
        })
    }
}