let { afkUsers } = require("../utils/Cache")
const moment = require("moment")
const Discord = require("discord.js")
module.exports = {
    event: "messageCreate",
    run: async (message) => {

        if (afkUsers.has(message.author.id)) {
            let user = afkUsers.get(message.author.id)
            let timeAgo = moment(user.timestamp).fromNow()

            try {
                await message.member.setNickname(user.username);
            } catch {
                afkUsers.delete(message.author.id);
                message.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setTitle("AFK Removed")
                            .setColor("Green")
                            .setDescription(
                                `Welcome back ${message.member} I have removed your afk!`
                            )
                            .addFields(
                                { name: `You have afked for:`, value: `${timeAgo}` },
                                { name: `Your message:`, value: `${user.reason}` }
                            )
                    ]
                })
            }
            if (!message.author?.bot) {
                message.mentions.members.forEach((user) => {
                    if (afkUsers.has(user.id)) {
                        let userA = afkUsers.get(user.id);
                        message.reply({
                            embeds: [
                                new Discord.EmbedBuilder()
                                    .setTitle("User Afk")
                                    .setColor("Random")
                                    .addFields(
                                        { name: `User`, value: user.user.tag },
                                        { name: `Reason:`, value: userA.reason },
                                        { name: `Afked for:`, value: timeAgo }
                                    )
                                    .setFooter({ text: "Imagine trolling someone" })
                            ]
                        })
                    }
                })
            }
    }
}
}