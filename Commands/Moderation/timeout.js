//const ms = import("ms");
//import { ms } from "ms";
const { EmbedBuilder } = require("discord.js");
module.exports = {
    name: "timeout",
    description: "Times outs a member",
    aliases: ["tm", "tmout", "mute"],
    category: "Moderation",
    permissions: ["KickMembers", "ModerateMembers"],
    deleteTrigger: true,
    run: async (client, message, args) => {
        const { default: ms } = await import("ms")
        const member =
            message.mentions.members.first() ||
            message.guild.members.cache.get(args[0])
        if (!member) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`You need to mention a user to timeout!`)
                        .setColor("Red"),
                ]
            })
        }
        args.shift();
        let duration = null;
        let reason = "No reason provided";
        if (args.length > 0) {
            if (ms(args[0])) {
                duration = ms(args[0]);
                args.shift();
            }
            if (args.length > 0) {
                reason = args.join(' ');
            }
        }
        if (!member.kickable) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setDescription("I don't have the required permissions to timeout this user!")
                ]
            })
        }
        if (member.id === message.author.id) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("You can't timeout yourself!")
                        .setColor("Red")
                ]
            })
        }
        if (
            message.member.roles.highest.comparePositionTo(member.roles.highest) < 1
        ) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setDescription(`You don't have the required permission to timeout a user!`)
                ]
            })
        }
        if (duration) {
            await member
                .send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setDescription(
                                `You have been timeouted in ${message.guild.name} for ${duration} for the following reason: ${reason}`
                            )
                    ]
                })
                .catch(() => { });
        
        member.timeout(duration, reason);
        return message.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setDescription(
                        `${member.user.tag} has been timed out for ${duration} for the following reason: ${reason}`,
                    )
            ]
        })
    } else {
        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor("Red")
                .setDescription(`You need to specify a duration for the timeout!`),
            ]
        })
    }

}
}