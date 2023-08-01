const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const djsVer = require("../../../package.json").dependencies;

module.exports = {
    category: "General",
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Bot information'),
    async run(client, interaction) {
        const { default: prettyMs } = await import("pretty-ms");
        let members = 0;
        client.guilds.cache.forEach(g => members += g.members.cache.filter(g => !g.bot).size);
        const clientUptime = prettyMs(client.uptime)
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${client.user.username}'s Info`)
                    .addFields(
                        { name: `Node`, value: `${process.version}`, inline: true },
                        { name: `Library`, value: `DiscordJS ${djsVer["discord.js"]}`, inline: true },
                        { name: `Founded by:`, value: `<@!758617912566087681>`, inline: true },
                        { name: `Special Thanks to:`, value: `<@!748597084134834186> (Wordle Command)`, inline: true },
                        { name: `Inspired by:`, value: `<@876788781523562557> From [IGP Coding Villa](https://discord.gg/igp, "Imagine Gaming Play Coding Villa")`, inline: true },
                        { name: `Servers`, value: `${client.guilds.cache.size}`, inline: true },
                        { name: `Users`, value: `${members}`, inline: true },
                        { name: `Ping`, value: `${client.ws.ping}`, inline: true },
                        { name: `Uptime`, value: `${clientUptime}`, inline: true }
                    )
                    .setThumbnail(client.user.displayAvatarURL())
                    .setAuthor({
                        name: client.user.tag,
                        iconURL: client.user.displayAvatarURL(),
                    })
                    .setColor("#a8f1b0")
                    .setTimestamp(),
            ], ephemeral: true
        })
    }
}