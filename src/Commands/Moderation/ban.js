const { EmbedBuilder } = require("discord.js");
const GuildSchema = require("../../Schema/Guild").GuildData;

module.exports = {
    name: `ban`,
    description: `Ban a member from the guild.`,
    permissions: ["BanMembers"],
    aliases: ["b"],
    category: 'Moderation',
    deleteTrigger: true,
    run: async (client, message, args) => {
        const member = message.mentions.members.first() || client.users.cache.get(args[0]);
        const Guild = await GuildSchema.findOne({ guild: message.guild.id });
        if (!member) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid Usage!")
                    .setDescription(`Usage: ${Guild.prefix}ban @user <reason>`)
                    .setColor("#f09999")
            ]
        })
        if (!member.kickable) return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Invalid Permissions!")
                    .setDescription(`I'm not authorized to ban ${member}`)
                    .setColor("#f09999")
            ]
        });
        args.shift();
        const reason = args.join(" ") || "No reason provided.";

        await message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setTitle(`${member.user.tag} has been banned`)
                .setColor("#f09999")
            ]
        })

        await member.send({
            embeds: [
                new EmbedBuilder()
                    .setDescription(`You has been banned from ${message.guild.name}!`)
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                    .addFields(
                        { name: `User`, value: member.user.tag },
                        { name: `Moderator`, value: message.author.tag },
                        { name: `Reason`, value: reason }
                    )
                    .setTimestamp()
                    .setColor("#f09999")
            ]
        }).catch(async err => {
            client.errorLogger.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("New DiscordAPI encounted")
                        .setDescription(`\`\`\`${err.stack}\`\`\``)
                        .setColor("#f09999")
                ]
            })
        });

        await member.ban({reason: reason});
        let serverCase = Guild.case;
        serverCase++;
        await GuildSchema.updateOne({ guild: message.guild.id }, { case: serverCase });
        Guild.cases.push({
            userId: member.user.id,
            reason: reason,
            case: `${serverCase} banAdd`,
            mod: message.author.id,
            timestamp: Date.now()
        })
        await GuildSchema.updateOne( { guild: message.guild.id }, {
            cases: Guild.cases 
        })

        if (!Guild.channel) return;
        const channel = client.channels.cache.get(Guild.channel);
        channel.send({
            embeds: [
                new EmbedBuilder()
                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
                .setColor("#f09999")
                .setTimestamp()
                .addFields(
                    { name: `User`, value: `<@!${member.user.id}> | ${member.user.id} `},
                    { name: `Moderator`, value: `<@!${message.author.id}> | ${message.author.id}`},
                    { name: `Case`, value: `${serverCase} | Ban`, inline: true},
                    { name: `Reason`, value: `${reason}`, inline: true}
                )
            ]
        })
    }
}