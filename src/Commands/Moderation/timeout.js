const { EmbedBuilder, time } = require("discord.js");
const GuildSchema = require("../../Schema/Guild").GuildData;

module.exports = {
    name: `timeout`,
    description: `Timeout a member from the guild.`,
    permissions: ["BanMember"],
    aliases: ["t", "timeout"],
    category: 'Moderation',
    deleteTrigger: true,
    run: async (client, message, args) => {
        const member = message.mentions.members.first() || client.users.cache.get(args[0]);
        const Guild = await GuildSchema.findOne({ guild: message.guild.id });
        const { default: ms } = await import("ms")
        if (!member || !args[1]) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid Usage!")
                    .setDescription(`Usage: ${Guild.prefix}timeout @user <duration> <reason>`)
                    .setColor("#f09999")
            ]
        })
        if (!member.bannable) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid Permissions!")
                    .setDescription(`I'm not authorized to mute ${member}`)
                    .setColor("#f09999")
            ]
        });
        if (member.user.id === message.author.id) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("Self timeout is not possible with this bot.")
                        .setColor("#f09999")
                ]
            })
        }
        args.shift();
        let reason = "No reason provided.";
        const timeoutDurationMS = ms(args[0]);

        if (isNaN(timeoutDurationMS)) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Invalid Timeout Duration")
                        .setDescription("Please provide a valid timeout duration.")
                        .setColor("#f09999")
                ]
            })
        }
        if (timeoutDurationMS < 5000 || timeoutDurationMS > 2.419e9) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Invalid Timeout Duration")
                        .setDescription("Time out duration cannot be less than 5 seconds or more then 28 days.")
                        .setColor("#f09999")
                ]
            })
        }

        if (args[1]) {
            reason = args[1]
        }

        const timeoutDuration = Math.round((Date.now() + timeoutDurationMS) / 1000)
        await message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${member.user.tag} has been timeouted`)
                    .setColor("#f09999")
            ]
        })
        await member.timeout(timeoutDurationMs, reason)
        await member.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`You has been timeouted from ${message.guild.name}!`)
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                    .addFields(
                        { name: `User`, value: member.user.tag },
                        { name: `Moderator`, value: message.author.tag },
                        { name: `Timeouted for`, value: `<t:${timeoutDuration}:F>` },
                        { name: `Reason`, value: reason }
                    )
                    .setTimestamp()
                    .setColor("#f09999")
            ]
        }).catch(async err => {
            console.log(err);
            await message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("User did not get timeouted DM")
                        .setDescription(`${member.user.tag} did not get the timeouted embed DM`)
                        .setColor("#f09999")
                ]
            })
        });

        //await member.ban({reason: reason});'
        let serverCase = Guild.case;
        serverCase++;
        await GuildSchema.updateOne({ guild: message.guild.id }, { case: serverCase });
        Guild.cases.push({
            userId: member.user.id,
            reason: reason,
            case: `${serverCase} timeoutAdd`,
            mod: message.author.id,
            timestamp: Date.now()
        })
        await GuildSchema.updateOne({ guild: message.guild.id }, {
            cases: Guild.cases
        })

        if (!Guild.channel) return;
        const channel = client.channels.cache.get(Guild.channel);
        let msg = await channel.send({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                    .setColor("#f09999")
                    .setTimestamp()
                    .addFields(
                        { name: `User`, value: `<@!${member.user.id}> | ${member.user.id} ` },
                        { name: `Moderator`, value: `<@!${message.author.id}> | ${message.author.id}` },
                        { name: `Case`, value: `${serverCase} | Timeout`, inline: true },
                        { name: `Timeouted for`, value: `${args[0]}`, inline: true },
                        { name: `Expires in`, value: `<t:${timeoutDuration}:R>`, inline: true },
                        { name: `Reason`, value: `${reason}` }
                    )
            ]
        })
        setTimeout(() => {
            msg.edit({
                embeds: [
                    new EmbedBuilder()
                        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                        .setColor("#f09999")
                        .setTimestamp()
                        .addFields(
                            { name: `User`, value: `<@!${member.user.id}> | ${member.user.id} ` },
                            { name: `Moderator`, value: `<@!${message.author.id}> | ${message.author.id}` },
                            { name: `Case`, value: `${serverCase} | Timeout`, inline: true },
                            { name: `Timeouted for`, value: `${args[0]}`, inline: true },
                            { name: `Expires `, value: `<t:${timeoutDuration}:R>`, inline: true },
                            { name: `Reason`, value: `${reason}`, inline: true }
                        )
                ]
            })
            channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                    .setColor("#a8f1b0")
                    .setTimestamp()
                    .addFields(
                        { name: `User`, value: `<@!${member.user.id}> | ${member.user.id} ` },
                        { name: `Moderator`, value: `<@!${message.author.id}> | ${message.author.id}` },
                        { name: `Case`, value: `${serverCase} | Timeout Expire`, inline: true },
                        { name: `Expires`, value: `<t:${timeoutDuration}:R>`, inline: true },
                        { name: `Reason`, value: `${reason}` }
                    )
                ]
            })
        }, timeoutDurationMS)
    }
}