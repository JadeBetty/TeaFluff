const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const VoteTrue = true;
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
        const voteLinksButton = new ActionRowBuilder()
        .setComponents(
            new ButtonBuilder()
            .setLabel("Top.gg")
            .setStyle(ButtonStyle.Link)
            .setURL("https://top.gg/bot/1033950258637590619")
            .setEmoji("<:topgg:1087591467385630761>"),
            new ButtonBuilder()
            .setLabel("Discord Bot List")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discordbotlist.com/bots/teafluff")
            .setEmoji("<:dbl:1087610629805838386>"),
            new ButtonBuilder()
            .setLabel("Discord List GG")
            .setStyle(ButtonStyle.Link)
            .setURL("https://discordlist.gg/bot/1033950258637590619/vote")
            .setEmoji("<:dl:1087714351575748722>"),
        )

        message.channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor("#a8f1b0")
                .setDescription(`Vote for ${client.user} with the buttons listed below!`)
                .setTitle("Vote")
                .setTimestamp()
            ],
            components: [
                voteLinksButton
            ]
        })
    }
}