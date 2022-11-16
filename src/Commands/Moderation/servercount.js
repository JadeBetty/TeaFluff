
const discord = require('discord.js');

module.exports = {
    name: "servercount",
    description: "View the number of the servers that the bot is in, and view their names",
    deeleTrigger: true,
    category: "Moderation",
    aliases: ["sc"],
    run: async (client, message, args) => {
        const guilds = []
        client.guilds.cache.forEach(server => guilds.push(server.name))
        const scEmbed = new discord.EmbedBuilder()
            .setAuthor({
                name: "Servers that I'm in",
                iconURL: client.user.displayAvatarURL()
            })
            .setDescription(guilds.join("\n"))
            .setFooter({ text: `Currently I'm in ${guilds.length} servers. ` })
        message.channel.send({ embeds: [scEmbed] })
    }
}