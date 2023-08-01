const { MessageActivityType } = require("discord.js");
const Discord = require("discord.js");
module.exports = {
    name: "membercount",
    description: "Shows current member count of the sever",
    deleteTrigger: true,
    aliases: ["members", "member", "memcount", "usercount"],
    category: "General",
    run: async (client, message, args) => {
        const memberCount = message.guild.memberCount

        const humans = (await message.guild.members.cache).filter(member => !member.user.bot).size
        const bots = (await message.guild.members.cache).filter(member => member.user.bot).size

        message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle(`Member Count For ${message.guild.name}`)
                    .setDescription(`**Total Member:** ${memberCount} \n **Total users:** ${humans} \n **Total bots:** ${bots}`)
                    .setTimestamp()
                    .setFooter({
                        text: `Requested by ${message.author.tag}`
                    })
                    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                    .setColor("#a8f1b0")
            ]
        })
    }
}