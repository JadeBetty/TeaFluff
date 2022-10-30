let {afkUsers} = require("../utils/Cache")
const moment = require("moment")
module.exports = {
    name: `messageCreate`,
    async run(message, { client, Discord, snipe }) {
        const prefix = "-"
        const prefix2 = "."
        if (message.content.startsWith(prefix) || message.content.startsWith(prefix2)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g)
        const commandName = args.shift()
        const command = client.commands.get(commandName) || client.aliases.get(commandName)
        if(!command) return
        command.run(client, message, args, Discord)
        }
        if(message.content.includes("imagine is not cool")) {
            message.channel.send("How dare you consider imagine is not cool?! You gotta get banned <:JimDullerDinglson:974359587136344064>.")
        }

        if(afkUsers.has(message.author.id)) {
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
                            {name: `You have afked for:`, value: `${timeAgo}`},
                            {name: `Your message:`, value: `${user.reason}`}
                        )
                    ]
                })
            } 
            if(!message.author?.bot) {
                message.mentions.members.forEach((user) => {
                    if(afkUsers.has(user.id)) {
                        let userA = afkUsers.get(user.id);
                        message.reply({
                            embeds: [
                                new Discord.EmbedBuilder()
                                .setTitle("User Afk")
                                .setColor("Random")
                                .addFields(
                                    {name: `User`, value: user.user.tag},
                                    {name: `Reason:`, value: userA.reason},
                                    {name: `Afked for:`, value: timeAgo}
                                )
                                .setFooter({text: "Imagine trolling someone"})
                            ]
                        })
                    }
                })
            }
        }

      }
 
     }
