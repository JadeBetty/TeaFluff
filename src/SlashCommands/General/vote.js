const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const VoteTrue = require("../../Commands/General/vote").voteTrue
module.exports = {
    category: "General",
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Vote for TeaFluff'),
    async run(client, interaction) {
        if(!VoteTrue) return interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Red")
                .setDescription(`${client.user.tag} is not currently being listed on any vote websites!`)
                .setTimestamp()
            ],
            ephemeral: true
        })
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("#a8f1b0")
                .setAuthor({name: client.user.tag, iconURL: client.user.displayAvatarURL()})
                .setDescription(`Vote for ${client.user.tag} on \n [Top.gg](https://top.gg, "Top.gg") \n more will be listed soon!`)
                .setTitle("Vote")
                .setTimestamp()
            ]
        })
    }
}