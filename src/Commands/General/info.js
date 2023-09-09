const Discord = require("discord.js");
const djsVer = require("../../../package.json").dependencies;
module.exports = {
    name: "info",
    description: "Bot infomation",
    deleteTrigger: true,
    category: 'General',
    aliases: ["Info", "Infomation", "information", "botinfo"],
    run: async (client, message, args) => {
        const { default: prettyMs } = await import("pretty-ms");
        let members = 0;
        client.guilds.cache.forEach(g => members += g.members.cache.filter(g => !g.bot).size);
        const clientUptime = prettyMs(client.uptime)
        message.channel.send({
            embeds: [
                new Discord.EmbedBuilder()
                    .setTitle(`${client.user.username}'s Info`)
                    .addFields(
                        { name: `Node`, value: `${process.version}`, inline: true },
                        { name: `Library`, value: `DiscordJS ${djsVer["discord.js"]}`, inline: true },
                        { name: `Founded by:`, value: `<@!758617912566087681>`, inline: true },
                        { name: `Special Thanks to:`, value: `<@!748597084134834186> (Wordle Command)\n<@!864372060305883136> (Hack Embed Template)`, inline: true },
                        { name: `Inspired by:`, value: `<@876788781523562557> From [IGP Coding Villa](https://discord.gg/igp, "Imagine Gaming Play Coding Villa")`, inline: true },
                        { name: `Servers`, value: `${client.guilds.cache.size}`, inline: true },
                        { name: `Users`, value: `${members}`, inline: true },
                        { name: `Ping`, value: `${client.ws.ping}`, inline: true },
                        { name: `Uptime`, value: `${clientUptime}`, inline: true },
                        { name: "Support Server", value: `[Support Server Invite Link](https://dsc.gg/teafluff-support "Click for TeaFluff Support!")`}
                    )
                    .setThumbnail(client.user.displayAvatarURL())
                    .setAuthor({
                        name: client.user.tag,
                        iconURL: client.user.displayAvatarURL(),
                    })
                    .setColor("#a8f1b0")
                    .setTimestamp(),
            ]
        })
    }
}