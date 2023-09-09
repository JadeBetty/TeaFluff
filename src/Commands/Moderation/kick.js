const { EmbedBuilder } = require("discord.js");
const GuildSchema = require("../../Schema/Guild").GuildData;
module.exports = {
    name: "kick",
    description: "Kick a user",
    permissions: ["KickMembers"],
    aliases: ["k"],
    category: "Moderation",
    deleteTrigger: true,
    run: async (client, message, args) => {
        const Guild = await GuildSchema.findOne({ guild: message.guild.id });
        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Invalid Usage")
                        .setDescription("Correct usage `.kick @user <reason>`")
                        .setColor("Red")
                        .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL()}` })
                ]
            });
        }
        let reason;
        if (!args[1]) {
            reason = "No reason specified.";
        } else {
            args.shift();
            reason = args.join(" ");
        }

        if (!member.kickable) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Invalid Permissions!")
                        .setDescription(`I'm not authorized to kick ${member}`)
                        .setColor("#f09999")
                ]
            })
        }

        await member.kick();
        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor("#f09999")
                .setTitle(`${member.user.tag} has been kicked!`)
            ]
        })
        try {
            await member.send({
                embeds: [
                    new EmbedBuilder()
                    .setAuthor({ name: message.author.tag , iconURL: message.author.displayAvatarURL() })
                    .setDescription(`You has been kicked from ${message.guild.name}`)
                    .addFields(
                        { name: `User`, value: member.user.tag },
                        { name: `Moderator`, value: message.author.tag },
                        { name: `Reason`, value: reason }
                    )
                    .setTimestamp()
                    .setColor("#f09999")
                ]
        })
        await member.kick()
        } catch (e) {
            client.errorLogger.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("New DiscordAPI encounted")
                        .setDescription(`\`\`\`${e.stack}\`\`\``)
                        .setColor("#f09999")
                ]
            })
        }

        let serverCase = Guild.case;
        serverCase++;
        await GuildSchema.updateOne({ guild: message.guild.id }, { case: serverCase });
        Guild.cases.push({
            userId: member.user.id,
            reason: reason,
            case: `${serverCase} kickAdd`,
            mod: message.author.id,
            timestamp: Date.now()
        })
        await GuildSchema.updateOne({ guild: message.guild.id }, { cases: Guild.cases });
        if(!Guild.channel) return;
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
                    { name: `Case`, value: `${serverCase} | Kick`},
                    { name: `Reason`, value: `${reason}`}
                )
            
            ]
        })



    }
}