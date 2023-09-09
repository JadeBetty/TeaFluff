const { EmbedBuilder } = require("discord.js");
module.exports = {
    event: "guildDelete",
    async run(guild, client) {
        client.channels.cache.get("1084095045784846376").send({
            embeds: [
                new EmbedBuilder()
                    .setTitle("We got kicked!")
                    .addFields(
                        { name: `Guild Name`, value: guild.name },
                        { name: `Total members`, value: `${guild.memberCount}` },
                        { name: `Owner`, value: `<@!${guild.ownerId}>` }
                    )
                    .setColor("#f09999")
            ]
        })
    }
}