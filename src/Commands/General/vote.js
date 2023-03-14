const { EmbedBuilder } = require("discord.js");
const VoteTrue = false;
module.exports = {
    name: "vote",
    description: "Vote for TeaFluff",
    category: "General",
    voteTrue: VoteTrue,
    aliases: ["vo", "v"],
    run: async (client, message, args) => {
        if(!VoteTrue) return message.channel.send({embeds: [
            new EmbedBuilder()
            .setColor("Red")
            .setDescription(`${client.user.tag} is not currently being listed on any vote websites!`)
            .setTimestamp()
        ]})

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor("#a8f1b0")
                .setAuthor({name: client.user.tag, iconURL: client.user.displayAvatarURL()})
                .setDescription(`Vote for ${client.user.tag} on \n [Top.gg](https://top.gg, "Top.gg") \n more will be listed soon!`)
                .setTitle("Vote")
                .setTimestamp()
            ],
        })
    }
}