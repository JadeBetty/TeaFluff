let { afkUsers } = require("../utils/Cache")
const moment = require("moment")
const Discord = require("discord.js")
module.exports = {
    event: `messageCreate`,
    async run(message) {
        const prefix = "-"
        const prefix2 = "."
        const Discord = require("discord.js")
        const ms = require('ms');
        const client = require('..');
        const config = require('../config.json');

        //   const prefix = client.prefix;
        const cooldown = new Discord.Collection();



        if (message.author.bot) return;
        if (message.channel.type !== 0) return;
        if (message.content.startsWith(prefix) || message.content.startsWith(prefix2)) {
            const args = message.content.slice(prefix.length || prefix2.length).trim().split(/ +/g);
            const cmd = args.shift().toLowerCase();
            if (cmd.length == 0) return;
            let command = client.commands.get(cmd)
            if (!command) command = client.commands.get(client.aliases.get(cmd));

            if (command) {
                if (command.cooldown) {
                    if (cooldown.has(`${command.name}${message.author.id}`)) return message.channel.send({
                        content: config.messages["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), {
                            long: true
                        }))
                    });
                    if (command.userPerms || command.botPerms) {
                        if (!message.member.permissions.has(Discord.PermissionsBitField.resolve(command.userPerms || []))) {
                            const userPerms = new Discord.EmbedBuilder()
                                .setDescription(`🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`)
                                .setColor('Red')
                            return message.reply({
                                embeds: [userPerms]
                            })
                        }
                        if (!message.guild.members.cache.get(client.user.id).permissions.has(Discord.PermissionsBitField.resolve(command.botPerms || []))) {
                            const botPerms = new Discord.EmbedBuilder()
                                .setDescription(`🚫 ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`)
                                .setColor('Red')
                            return message.reply({
                                embeds: [botPerms]
                            })
                        }
                    }

                    command.run(client, message, args)
                    cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown)
                    setTimeout(() => {
                        cooldown.delete(`${command.name}${message.author.id}`)
                    }, command.cooldown);
                } else {
                    if (command.userPerms || command.botPerms) {
                        if (!message.member.permissions.has(Discord.PermissionsBitField.resolve(command.userPerms || []))) {
                            const userPerms = new Discord.EmbedBuilder()
                                .setDescription(`🚫 ${message.author}, You don't have \`${command.userPerms}\` permissions to use this command!`)
                                .setColor('Red')
                            return message.reply({
                                embeds: [userPerms]
                            })
                        }

                        if (!message.guild.members.cache.get(client.user.id).permissions.has(Discord.PermissionsBitField.resolve(command.botPerms || []))) {
                            const botPerms = new Discord.EmbedBuilder()
                                .setDescription(`🚫 ${message.author}, I don't have \`${command.botPerms}\` permissions to use this command!`)
                                .setColor('Red')
                            return message.reply({
                                embeds: [botPerms]
                            })
                        }
                    }
                    command.run(client, message, args)
                }
            }

        }


        if (message.content.includes("imagine is not cool")) {
            message.channel.send("How dare you consider imagine is not cool?! You gotta get banned <:JimDullerDinglson:974359587136344064>.")
        }
        if (message.content === "<@1033950258637590619>") {
            message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                    .setTitle(`Hello!, I'm ${client.user.username}`)
                    .setDescription(`Below is how you use a command with my Prefix and Usage!`)
                    .addFields(
                        {name: `Prefix:`, value: ` \`-\` || \`.\``, inline: true},
                        {name: `Usage: `, value: `\`-[command] \` || \`.[command]\``, inline: true}
                    )
                    .setColor("#f1a8d4")
                    .setFooter({
                    text: `Use -info for more information!`
                    })
                    .setThumbnail(client.user.displayAvatarURL())
                    .setAuthor({
                        name: client.user.tag,
                        iconURL: client.user.displayAvatarURL()
                    })
                ]
            })
        }

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