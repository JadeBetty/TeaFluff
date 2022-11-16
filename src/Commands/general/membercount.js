const Discord = require("discord.js");
module.exports = {
    name: "membercount",
    description: "Shows current member count of the sever",
    aliases: ["members", "member", "memcount", "usercount"],
    category: "General",
    run: async (client, message, args) => {
        const memberCount = message.guild.memberCount

        const humans = (await message.guild.members.fetch()).filter(member => !member.user.bot).size
        const bots = (await message.guild.members.fetch()).filter(member => member.user.bot).size

        message.reply({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle(`Member Count For ${message.guild.name}`)
                    .setDescription(`**Total Member:** ${memberCount} \n **Total humans:** ${humans} \n **Total bots:** ${bots}`)
                    .setTimestamp()
                    .setFooter({
                        text: `Requested by ${message.author.tag}`
                    })
                    .setColor("Blurple")
            ]
        })
    }
}