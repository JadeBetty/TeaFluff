const { EmbedBuilder } = require("discord.js");
const imports = require("../imports/embed");
const BLGuild = require("../Schema/Blacklist");
const BLUser = require("../Schema/Blacklist").bluser;
module.exports = {
    name: "blacklist",
    description: "Blacklist a user / guild.",
    devsOnly: true,
    deleteTrigger: true,
    run: async (client, message, args) => {
        const { default: ms } = await import("pretty-ms");
        const command = args[0];
        if (!command) return message.author.send({
            embeds: [
                imports.NCMD
            ]
        })
        if (command.toLowerCase() === "guild") {
            args.shift();
            const guild = client.guilds.cache.get(args[0]);
            if (!guild) {
                return message.author.send({
                    embeds: [
                        imports.NCMD
                    ]
                })
            }
            const guildCheck = await BLGuild.findOne({ guildId: guild.id });
            if (guildCheck) {
                return await message.author.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Guild Already Blacklisted")
                            .setDescription(`Guild Name: **${guild.name}** is already blacklisted.`)
                            .setColor("#f09999")
                    ]
                })
            }
            args.shift();
            const reason = args.join(" ");
            if (!reason) return message.author.send({
                embeds: [
                    imports.NRE
                ]
            })
            await BLGuild.create({
                guildId: guild.id,
                reason: reason
            });
            return message.author.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("Guild Blacklisted!")
                        .addFields(
                            { name: `Guild Name`, value: guild.name },
                            { name: `Reason`, value: reason }
                        )
                ]
            })
        }
        if (command.toLowerCase() === "user") {
            args.shift();
            const user = message.mentions.members.first() || client.users.cache.get(args[0]);
            if (!user) {
                return message.author.send({
                    embeds: [
                        imports.NCMD
                    ]
                })
            }
            console.log(user);
            const userCheck = await BLUser.findOne({ userId: user.id });
            if (userCheck) {
                return await message.author.send({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("User Already Blacklisted")
                            .setDescription(`User: **${user.tag}** is already blacklisted.`)
                            .setColor("#f09999")
                    ]
                })
            }


            args.shift();
            const reason = args.join(" ");
            if (!reason) return message.author.send({
                embeds: [
                    imports.NRE
                ]
            })
            await BLUser.create({
                guildId: user.id,
                reason: reason
            })
            return message.author.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle("User Blacklisted!")
                        .addFields(
                            { name: `Username`, value: `${user} || ${user.id}` },
                            { name: `Reason`, value: reason }
                        )
                ]
            })
        }
    }
}